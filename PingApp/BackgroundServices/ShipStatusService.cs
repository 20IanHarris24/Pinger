using System.Net.NetworkInformation;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Hubs;
using PingApp.Models.Entities;

namespace PingApp.BackgroundServices
{
    public class ShipStatusService : BackgroundService

    {


    private readonly IHubContext<DisplayHub> _displayHubContext;
    private readonly ILogger<ShipStatusService> _logger;
    private readonly IServiceScopeFactory _scopeFactory; //new code



    public ShipStatusService(IHubContext<DisplayHub> displayHubContext, ILogger<ShipStatusService> logger, IServiceScopeFactory scopeFactory)
    {

        _displayHubContext = displayHubContext;
        _logger = logger;
        _scopeFactory = scopeFactory; //new code


    }


    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
            using var scope = _scopeFactory.CreateScope(); //new code
            using var dbContext = scope.ServiceProvider.GetRequiredService<PingAppDbContext>(); //new code


        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("ShipStatusService running at: {time}", DateTimeOffset.Now);


            // Limit the concurrent number of threads to 5
            var simultaneous = new SemaphoreSlim(5);

            // Create a list of tasks to run

            var shipsDb = await dbContext.ShipModel.AsNoTracking().ToListAsync(stoppingToken);


            var tasks =  shipsDb.Select(async ship =>

            {
                // ... but wait for each 5 tasks
                // before running the next 5 tasks
                await simultaneous.WaitAsync(stoppingToken);
                try
                {
                    // Run the task
                    return await PingShipAsync(ship, stoppingToken);
                }
                catch (Exception exception)
                {
                    // handle the exception if any ships are not reachable
                    return new ShipResult()
                    {
                        Id = ship.Id,
                        Name = ship.Name,
                        HostAddr = ship.HostAddr,
                        Result = exception.Message
                    };
                }
                finally
                {
                    // Always release the semaphore
                    // when done
                    simultaneous.Release();
                }
            });


            // Now we actually run the tasks
            var shipResults = await Task.WhenAll(tasks);

            await _displayHubContext.Clients.All.SendAsync("DisplayShips", shipResults, cancellationToken: stoppingToken);

            await Task.Delay(2000, stoppingToken);

        }

    }

    private async Task<ShipResult> PingShipAsync(ShipModel ship, CancellationToken stoppingToken)
    {
        var timeout = 3000;
        var response = new Ping();
        PingReply result = await response.SendPingAsync(ship.HostAddr, TimeSpan.FromMilliseconds(timeout),null, null,stoppingToken);
        var roundTrip = result.Status == IPStatus.Success ? result.RoundtripTime : timeout;
        return new ShipResult()
        {
            Id = ship.Id,
            Name = ship.Name,
            HostAddr = ship.HostAddr,
            Result = $"Result: {result.Status.ToString()}. Time: {roundTrip} ms."
        };
    }
    }
}