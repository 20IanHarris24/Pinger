using System.Collections.Concurrent;
using PingApp.Interfaces;


namespace PingApp.ServicesBackend;

public class ShipStatusService : IShipStatusService
{
    
    private readonly ConcurrentDictionary<Guid, string> _latestPing;
    private readonly ILogger<ShipStatusService> _logging;
    
    
    
    public ShipStatusService(ConcurrentDictionary<Guid, string> latestPingResults, ILogger<ShipStatusService> logger)
    {

        _logging = logger;
        _latestPing = latestPingResults;
       

    }
   
    public string GetLatestPingResult(Guid shipId)
    {
        _logging.LogInformation("Current keys in _latestPingResults: \n{Keys}", string.Join(Environment.NewLine, _latestPing.Select(lp => "\t\t\t\t" + lp.Key)));
        return _latestPing.TryGetValue(shipId, out var result) ? result : "Unknown";
    }
  
    public bool RemoveLatestPingResult(Guid deletedShipId)
    {
        _logging.LogInformation("Current keys in _latestPingResults: {Keys}", string.Join(", ", _latestPing.Keys));
        _logging.LogInformation("Attempting to remove ping result for ShipId: {Id}", deletedShipId);

        return _latestPing.TryRemove(deletedShipId, out _);
    }
   
   
}