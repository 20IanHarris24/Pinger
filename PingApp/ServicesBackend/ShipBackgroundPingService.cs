using System.Collections.Concurrent;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Interfaces;
using PingApp.Models.Dtos;
using PingApp.Models.Entities;

namespace PingApp.ServicesBackend
{
    public class ShipBackgroundPingService : BackgroundService, IShipPingRequester

    {

    private readonly ILogger<ShipBackgroundPingService> _logging;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IShipStatusMaintenance _maintenance;
    private readonly IShipStatusService _statusSrv;
    private readonly NotifierService _toNotifyOf;
    private readonly SemaphoreSlim _simultaneousNoOfPings = new (5);
    private readonly ConcurrentDictionary<Guid, Task> _inFlight = new(); 
    


    public ShipBackgroundPingService(IShipStatusService statusSrv, IShipStatusMaintenance maintenance,NotifierService notifier, ILogger<ShipBackgroundPingService> logger, IServiceScopeFactory scopeFactory)
    {

        _logging = logger;
        _toNotifyOf = notifier;
        _maintenance = maintenance;
        _statusSrv = statusSrv;
        _scopeFactory = scopeFactory;


    }
    
   protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {

        
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope(); //new code
            var dbContext = scope.ServiceProvider.GetRequiredService<PingAppDbContext>();
            
            _logging.LogDebug("ShipBackgroundPingService tick at: {time}", DateTimeOffset.Now);
            
            var shipsDb = await dbContext.ShipModel.AsNoTracking().ToListAsync(stoppingToken); // Create a list of tasks to run
            
            
            var liveIds = shipsDb.Select(s => s.Id).ToHashSet();
            
            _maintenance.PruneToLiveIds(liveIds); //updates on the next cycle, the cache by removing stale Ids that have been deleted
            
            var tasks =  shipsDb.Select(async ship =>
            {
               await _simultaneousNoOfPings.WaitAsync(stoppingToken); // ...wait for each 5 tasks, before running the next 5 tasks
                try
                {
                    return await PingShipAsync(ship, stoppingToken); // Run the task
                }
                catch (Exception exception)
                {
                    // handle the exception if any ships are not reachable
                    return new ShipStatusDto
                    {
                        Id = ship.Id,
                        Name = ship.Name,
                        HostAddr = ship.HostAddr,
                        Result = exception.Message
                    };
                }
                finally
                {
                    _simultaneousNoOfPings.Release(); // Always release the semaphore when done
                }
            });


            // Now we actually run the tasks
            var shipStatuses = await Task.WhenAll(tasks);
            _logging.LogDebug("Broadcasting ping results for ships:\n{ShipIds}", string.Join(Environment.NewLine, shipStatuses.Select(s => "\t\t" + s.Id)));
            await _toNotifyOf.BroadcastShipStatuses(shipStatuses, stoppingToken);
            await Task.Delay(2000, stoppingToken);

        }

    }

    private async Task<ShipStatusDto> PingShipAsync(ShipModel ship, CancellationToken stoppingToken)
    {
        _logging.LogDebug("Pinging ship {Name} ({Id}) at {Host}", ship.Name, ship.Id, ship.HostAddr);

        var timeout = 3000;
        
        if (string.IsNullOrWhiteSpace(ship.HostAddr))
        {
            var msg = "No host configured";
            
            _statusSrv.SetLatestPingStatus(ship.Id, msg);

            return new ShipStatusDto
            {
                Id       = ship.Id,
                Name     = ship.Name,
                HostAddr = ship.HostAddr,
                Result   = msg
            };
        }
        
        if (!Uri.CheckHostName(ship.HostAddr).HasFlag(UriHostNameType.Dns) &&
            !IPAddress.TryParse(ship.HostAddr, out _))
        {
            var msg = $"Invalid host: {ship.HostAddr}";
            
            _statusSrv.SetLatestPingStatus(ship.Id, msg);

            return new ShipStatusDto
            {
                Id       = ship.Id,
                Name     = ship.Name,
                HostAddr = ship.HostAddr,
                Result   = msg
            };
        }


        try
        {
            using var response = new Ping();
            var result = await response.SendPingAsync(ship.HostAddr, TimeSpan.FromMilliseconds(timeout),null, null,stoppingToken);
            var roundTrip = result.Status == IPStatus.Success ? result.RoundtripTime : timeout;
            var resultString = $"{result.Status}. Time: {roundTrip} ms.";
            
            _statusSrv.SetLatestPingStatus(ship.Id, resultString);
        
            return new ShipStatusDto
            {
                Id = ship.Id,
                Name = ship.Name,
                HostAddr = ship.HostAddr,
                Result = resultString
            };

        }
        catch (PingException ex) when (ex.InnerException is SocketException se)
        {
            var msg = $"Ping failed: {se.Message}";
            
            _statusSrv.SetLatestPingStatus(ship.Id, msg);
          
            _logging.LogWarning(
                ex,
                "Ping failed for ship {ShipName} ({ShipId}) host '{HostAddr}'. Socket error {Code}: {SocketMessage}",
                ship.Name, ship.Id, ship.HostAddr, se.ErrorCode, se.Message);

            return new ShipStatusDto
            {
                Id       = ship.Id,
                Name     = ship.Name,
                HostAddr = ship.HostAddr,
                Result   = msg
            };
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
            var msg = "Ping cancelled";
            
            _statusSrv.SetLatestPingStatus(ship.Id, msg);

            
            return new ShipStatusDto
            {
                Id       = ship.Id,
                Name     = ship.Name,
                HostAddr = ship.HostAddr,
                Result   = msg
            };
        }
        catch (Exception ex)
        {
            var msg = $"Unexpected ping error: {ex.Message}";
            
            _statusSrv.SetLatestPingStatus(ship.Id, msg);

           
            _logging.LogError(
                ex,
                "Unexpected error pinging ship {ShipName} ({ShipId}) host '{HostAddr}'.",
                ship.Name, ship.Id, ship.HostAddr);

            return new ShipStatusDto
            {
                Id       = ship.Id,
                Name     = ship.Name,
                HostAddr = ship.HostAddr,
                Result   = msg
            };
        }
    
        
        
    }
    
    public Task PingNowAsync(Guid shipId, CancellationToken ct)
    {
        return _inFlight.GetOrAdd(shipId, _ => PingNowInternalAsync(shipId, ct));
    }

    private async Task PingNowInternalAsync(Guid shipId, CancellationToken ct)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var dBContext = scope.ServiceProvider.GetRequiredService<PingAppDbContext>();
            
            var ship = await dBContext.ShipModel
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == shipId, ct);
            
            if (ship == null) 
                throw new KeyNotFoundException($"Ship {shipId} not found");
            await _simultaneousNoOfPings.WaitAsync(ct);
            try
            {
                var status = await PingShipAsync(ship, ct);
                await _toNotifyOf.BroadcastShipStatuses(new[] { status }, ct);
            }   
            finally
            {
                _simultaneousNoOfPings.Release();
            }    
        }
        finally
        {
            _inFlight.TryRemove(shipId, out _);
        }
    }
    
    
    
    
    
   
   }
}