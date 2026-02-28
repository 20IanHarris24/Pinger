namespace PingApp.Interfaces;

public interface IShipPingRequester
{
    Task PingNowAsync(Guid shipId, CancellationToken ct);
}