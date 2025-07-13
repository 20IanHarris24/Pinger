using PingApp.Models.Dtos;
using PingApp.Models.Entities;

namespace PingApp.Interfaces;

public interface IShipStatusService
{
  
    string GetLatestPingResult(Guid shipId);
    bool RemoveLatestPingResult(Guid deletedShipId);
   

}