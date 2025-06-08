using System.Collections.Concurrent;
using System.Net.NetworkInformation;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Hubs;
using PingApp.Models.Entities;

namespace PingApp.ServicesBackend
{
    public class ShipStatusService : BackgroundService

    {

    private readonly ConcurrentDictionary<Guid, string> _latestPingResults = new();
    private readonly IHubContext<DisplayHub> _hubContext;
    private readonly ILogger<ShipStatusService> _logger;
    private readonly IServiceScopeFactory _scopeFactory; //new code



    public ShipStatusService(IHubContext<DisplayHub> hubContext, ILogger<ShipStatusService> logger, IServiceScopeFactory scopeFactory)
    {

        _hubContext = hubContext;
        _logger = logger;
        _scopeFactory = scopeFactory;


    }
    
   protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
            using var scope = _scopeFactory.CreateScope(); //new code
            await using var dbContext = scope.ServiceProvider.GetRequiredService<PingAppDbContext>(); //new code


        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("ShipStatusService running at: {time}", DateTimeOffset.Now);


            // Limit the concurrent number of threads to 5
            var simultaneous = new SemaphoreSlim(5);

            // Create a list of tasks to run

            var shipsDb = await dbContext.ShipModel.AsNoTracking().ToListAsync(stoppingToken);


            var tasks =  shipsDb.Select(async ship =>

            {
                // ... but wait for each 5 tasks, before running the next 5 tasks
                await simultaneous.WaitAsync(stoppingToken);
                try
                {
                    // Run the task
                    return await PingShipAsync(ship, stoppingToken);
                }
                catch (Exception exception)
                {
                    // handle the exception if any ships are not reachable
                    return new ShipResult
                    {
                        Id = ship.Id,
                        Name = ship.Name,
                        HostAddr = ship.HostAddr,
                        Result = exception.Message
                    };
                }
                finally
                {
                    // Always release the semaphore when done
                    simultaneous.Release();
                }
            });


            // Now we actually run the tasks
            var shipResults = await Task.WhenAll(tasks);

            await _hubContext.Clients.All.SendAsync("DisplayShips", shipResults, cancellationToken: stoppingToken);

            await Task.Delay(2000, stoppingToken);

        }

    }

    private async Task<ShipResult> PingShipAsync(ShipModel ship, CancellationToken stoppingToken)
    {
        var timeout = 3000;
        var response = new Ping();
        PingReply result = await response.SendPingAsync(ship.HostAddr!, TimeSpan.FromMilliseconds(timeout),null, null,stoppingToken);
        var roundTrip = result.Status == IPStatus.Success ? result.RoundtripTime : timeout;
        var resultString = $"{result.Status}. Time: {roundTrip} ms.";
        
        _latestPingResults[ship.Id] = resultString;
        
        
        return new ShipResult()
        {
            Id = ship.Id,
            Name = ship.Name,
            HostAddr = ship.HostAddr,
            Result = $"{result.Status.ToString()}. Time: {roundTrip} ms."
        };
    }
    
    public string GetLatestPingResult(Guid shipId)
    {
        return _latestPingResults.TryGetValue(shipId, out var result) ? result : "Unknown";
    }
  
    public bool RemoveLatestPingResult(Guid deletedShipId)
    {
        return _latestPingResults.TryRemove(deletedShipId, out _);
    }
    
    }
}