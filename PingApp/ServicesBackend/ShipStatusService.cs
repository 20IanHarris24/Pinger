using System.Collections.Concurrent;
using PingApp.Interfaces;


namespace PingApp.ServicesBackend;

public class ShipStatusService : IShipStatusService, IShipStatusMaintenance 
{
    
    private readonly ConcurrentDictionary<Guid, string> _latestPing;
    private readonly ILogger<ShipStatusService> _logging;
    
    
    
    public ShipStatusService(ConcurrentDictionary<Guid, string> latestPingResults, ILogger<ShipStatusService> logger)
    {

        _latestPing = latestPingResults;
        _logging = logger;
    }

    public void PruneToLiveIds(ICollection<Guid> liveIds)
    {
        foreach (var cachedId in _latestPing.Keys.ToArray())    
        {
            if (!liveIds.Contains(cachedId))
                _latestPing.TryRemove(cachedId, out _);
        }
        
    }
   
   public string GetLatestPingResult(Guid shipId)
    {
        //_logging.LogInformation("Current keys in _latestPingResults: \n{Keys}", string.Join(Environment.NewLine, _latestPing.Select(lp => "\t\t\t\t" + lp.Key)));
        return _latestPing.TryGetValue(shipId, out var result) ? result : "Unknown";
    }
  
    public void SetLatestPingStatus(Guid shipId, string status)
    {
       
        _latestPing[shipId] = status;
        
        _logging.LogDebug(
            "Ping status updated for ShipId {ShipId}: {Status}", shipId, status);
    }
   
   public IReadOnlyCollection<Guid> GetCachedShipIds() => _latestPing.Keys.ToArray();
    
    
    
}