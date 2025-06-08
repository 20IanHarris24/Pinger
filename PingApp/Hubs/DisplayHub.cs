using Microsoft.AspNetCore.SignalR;
using PingApp.DataAndHelpers;

namespace PingApp.Hubs
{
    public class DisplayHub : Hub
    {
        public async Task DisplayShip(Ship[] ships)
        {
            await Clients.All.SendAsync("DisplayShips", ships);
        }
        
        
        public async Task ShipCreated(Ship newShip)
        {
            await Clients.All.SendAsync("ShipCreated", newShip);
        }

        public async Task ShipUpdated(Ship updatedShip)
        {
            await Clients.All.SendAsync("ShipUpdated", updatedShip);
        }

       public async Task ShipDeleted(Guid deletedShipId)
        {
            await Clients.All.SendAsync("ShipDeleted", deletedShipId);
        }
        
    
    }
}