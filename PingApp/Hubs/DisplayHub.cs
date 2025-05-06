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
    }
}