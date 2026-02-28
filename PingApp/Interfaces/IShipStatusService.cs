


namespace PingApp.Interfaces;

public interface IShipStatusService
{
    string GetLatestPingResult(Guid shipId);
  
    void SetLatestPingStatus(Guid shipId, string status);
    
    
}