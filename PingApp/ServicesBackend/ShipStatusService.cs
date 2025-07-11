using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Interfaces;
using PingApp.Models.Dtos;
using PingApp.Models.Entities;

namespace PingApp.ServicesBackend;

public class ShipStatusService : IShipStatusService
{
    
    private readonly ConcurrentDictionary<Guid, string> _latestPing;
    private readonly ILogger<ShipStatusService> _logging;
    private readonly PingAppDbContext _dbContext;
    
    
    
    public ShipStatusService(ConcurrentDictionary<Guid, string> latestPingResults, ILogger<ShipStatusService> logger, PingAppDbContext context)
    {

        _dbContext = context;
        _logging = logger;
        _latestPing = latestPingResults;
       

    }
    
    
   
    public string GetLatestPingResult(Guid shipId)
    {
        return _latestPing.TryGetValue(shipId, out var result) ? result : "Unknown";
    }
  
    public bool RemoveLatestPingResult(Guid deletedShipId)
    {
        _logging.LogInformation("Current keys in _latestPingResults: {Keys}", string.Join(", ", _latestPing.Keys));
        _logging.LogInformation("Attempting to remove ping result for ShipId: {Id}", deletedShipId);

        return _latestPing.TryRemove(deletedShipId, out _);
    }
    
    
    public async Task<PaginatedDisplay<ShipModel>> GetPaginatedShips(int page, int size, string? search = null)
    {
        var query = _dbContext.ShipModel.AsQueryable();
    
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(s => s.Name!.Contains(search));
    
        var totalCount = await query.CountAsync();
        var data = await query
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync();
    
        return new PaginatedDisplay<ShipModel>(data, page, size, totalCount);
    }
}