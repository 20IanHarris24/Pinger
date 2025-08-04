using System.Collections.Concurrent;
using System.Net.NetworkInformation;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Hubs;
using PingApp.Models.Entities;

namespace PingApp.ServicesBackend
{
    public class ShipBackgroundPingService : BackgroundService

    {

    private readonly ConcurrentDictionary<Guid, string> _latestPing;
    private readonly IHubContext<DisplayHub> _hubContext;
    private readonly ILogger<ShipBackgroundPingService> _logging;
    private readonly IServiceScopeFactory _scopeFactory;
    


    public ShipBackgroundPingService(ConcurrentDictionary<Guid, string> latestPingResults, IHubContext<DisplayHub> hubContext, ILogger<ShipBackgroundPingService> logger, IServiceScopeFactory scopeFactory)
    {

        _hubContext = hubContext;
        _latestPing = latestPingResults;
        _logging = logger;
        _scopeFactory = scopeFactory;


    }
    
   protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {


        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope(); //new code
            await using var dbContext = scope.ServiceProvider.GetRequiredService<PingAppDbContext>();
            
            _logging.LogInformation("ShipBackgroundPingService running in the background at: {time}", DateTimeOffset.Now);
            
            var simultaneousNoOfPings = new SemaphoreSlim(5); // Limit the concurrent number of threads to 5

            var shipsDb = await dbContext.ShipModel.AsNoTracking().ToListAsync(stoppingToken); // Create a list of tasks to run
            
            // shipsDb = shipsDb.Where(ship => !deletedShipIds.Contains(ship.Id)).ToList();

            var tasks =  shipsDb.Select(async ship =>

            {
               await simultaneousNoOfPings.WaitAsync(stoppingToken); // ...wait for each 5 tasks, before running the next 5 tasks
                try
                {
                    return await PingShipAsync(ship, stoppingToken); // Run the task
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
                    simultaneousNoOfPings.Release(); // Always release the semaphore when done
                }
            });


            // Now we actually run the tasks
            var shipResults = await Task.WhenAll(tasks);
            _logging.LogInformation("Broadcasting ping results for ships:\n{ShipIds}", string.Join(Environment.NewLine, shipResults.Select(s => "\t\t" + s.Id)));
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
        
        _latestPing[ship.Id] = resultString;
        //_logging.LogInformation("Ping updated for id {ShipId}: {Result}", ship.Id, resultString);
        

        
        return new ShipResult()
        {
            Id = ship.Id,
            Name = ship.Name,
            HostAddr = ship.HostAddr,
            Result = $"{result.Status.ToString()}. Time: {roundTrip} ms."
        };
        
    }
    
   
   }
}