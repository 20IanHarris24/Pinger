using Microsoft.AspNetCore.SignalR;
using PingApp.Hubs;
using PingApp.Models.Dtos;


namespace PingApp.ServicesBackend;

public class NotifierService
{
    private readonly IHubContext<DisplayHub> _hubContext;
    
    public NotifierService(IHubContext<DisplayHub> hubContext)
    {
        
        _hubContext = hubContext;
      
    }
    
    
    public async Task ShipIsCreated(ShipDto newShip)
    {
        await _hubContext.Clients.All.SendAsync("ShipCreated", newShip);
    }

    public async Task ShipIsUpdated(ShipStatusDto editShip)
    {
        await _hubContext.Clients.All.SendAsync("ShipUpdated", editShip);
    }

    public async Task ShipIsDeleted(Guid deletedShipId)
    {
        await _hubContext.Clients.All.SendAsync("ShipDeleted", deletedShipId);
    }
    
    public async Task BroadcastShipStatuses(ShipStatusDto[] shipResults, CancellationToken ct = default)
    {
        await _hubContext.Clients.All.SendAsync("DisplayShips", shipResults, cancellationToken: ct);
    }

    
    
}