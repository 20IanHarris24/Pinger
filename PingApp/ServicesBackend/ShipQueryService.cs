using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Interfaces;
using PingApp.Models.Dtos;


namespace PingApp.ServicesBackend;

public class ShipQueryService : IShipQueryService
{
    
    
    private readonly PingAppDbContext _dbContext;

    public ShipQueryService(PingAppDbContext context)
    {
        _dbContext = context;
    }
    
    public async Task<PaginatedDisplay<ShipDto>> GetPaginatedShips(int page, int size, string? search = null, string? sort = null, string? direction = null)
    {
        var pageNumber = page < 1 ? 1 : page;
        var pageSize = size > 100 ? 100 : size;
        
        var query = _dbContext.ShipModel.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            
            query = query.Where(s => s.Name!.Contains(search));
        }
        
        query = (sort!.ToLower(), direction!.ToLower()) switch
        {
            ("name", "desc") => query.OrderByDescending(s => s.Name),
            ("name", _) => query.OrderBy(s => s.Name),
            _ => query.OrderBy(s => s.Name) // default
        };

    
        var totalCount = await query.CountAsync();
        
        var data = await query
            .Skip((page - 1) * size)
            .Take(size)
            .Select(s => new ShipDto
            {
                Id = s.Id,
                Name = s.Name!,
                HostAddr = s.HostAddr!
            })
            .ToListAsync();
    
        return new PaginatedDisplay<ShipDto>(data, pageNumber, pageSize, totalCount);
    }
}