namespace PingApp.Interfaces;

public interface IShipStatusMaintenance
{
    void PruneToLiveIds(ICollection<Guid> liveIds);
}