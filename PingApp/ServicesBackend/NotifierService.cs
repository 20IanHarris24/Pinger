using Microsoft.AspNetCore.SignalR;
using PingApp.DataAndHelpers;
using PingApp.Hubs;
using PingApp.Models.Entities;

namespace PingApp.ServicesBackend;

public class NotifierService
{
    private readonly IHubContext<DisplayHub> _hubContext;
    
    public NotifierService(IHubContext<DisplayHub> hubContext)
    {
        
        _hubContext = hubContext;
      
    }
    
    
    public async Task ShipIsCreated(ShipModel newShip)
    {
        await _hubContext.Clients.All.SendAsync("ShipCreated", newShip);
    }

    public async Task ShipIsUpdated(ShipResult editShip)
    {
        await _hubContext.Clients.All.SendAsync("ShipUpdated", editShip);
    }

    public async Task ShipIsDeleted(Guid deletedShipId)
    {
        await _hubContext.Clients.All.SendAsync("ShipDeleted", deletedShipId);
    }
    
    
    
    
}