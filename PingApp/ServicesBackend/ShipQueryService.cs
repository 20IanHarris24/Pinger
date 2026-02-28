using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Interfaces;
using PingApp.Models.Dtos;
using PingApp.Models.Entities;


namespace PingApp.ServicesBackend;

public class ShipQueryService : IShipQueryService
{
    private readonly IShipStatusService _status;
    private readonly NotifierService _notifyThat;
    private readonly PingAppDbContext _dbContext;

    public ShipQueryService(NotifierService notify, PingAppDbContext context,
        IShipStatusService status)
    {
        _dbContext = context;
        _notifyThat = notify;
        _status = status;
    }


    public async Task<PaginatedDisplay<ShipDto>> GetPaginatedShips(int page, int size,
        string sort, string direction)
    {
        var pageNumber = page < 1 ? 1 : page;
        var pageSize = size > 100 ? 100 : size;

        var dataQuery = _dbContext.ShipModel.AsQueryable();

        bool sortByName       = string.Equals(sort, "name", StringComparison.OrdinalIgnoreCase);
        bool sortByDirection = string.Equals(direction, "desc", StringComparison.OrdinalIgnoreCase);
        
        dataQuery = (sortByName, sortByDirection) switch
        {
            (true, true)  => dataQuery.OrderByDescending(s => EF.Functions.Collate (s.Name, "NOCASE"))
                .ThenByDescending(s => s.Id),
            (true, false) => dataQuery.OrderBy(s => EF.Functions.Collate(s.Name, "NOCASE"))
            .ThenBy(s => s.Id),
            _                            => dataQuery.OrderBy(s => EF.Functions.Collate(s.Name, "NOCASE"))
                .ThenBy(s => s.Id)// default
        };
        
      

        var totalCount = await dataQuery.CountAsync();

        var data = await dataQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new ShipDto
            {
                Id = s.Id,
                Name = s.Name,
                HostAddr = s.HostAddr
            })
            .ToListAsync();

        return new PaginatedDisplay<ShipDto>(data, pageNumber, pageSize, totalCount, sort, direction);
    }


    public async Task<IReadOnlyList<ShipDto>> GetAllShipsAsync(CancellationToken ct = default)
    {
        return await _dbContext.ShipModel
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .Select(s => new ShipDto()
            {
                Id = s.Id,
                Name = s.Name,
                HostAddr = s.HostAddr
            })
            .ToListAsync(ct);
    }


    public Task<ShipDto?> GetShipByIdAsync(Guid id, CancellationToken ct) =>
        _dbContext.ShipModel
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new ShipDto { Id = s.Id, Name = s.Name, HostAddr = s.HostAddr })
            .SingleOrDefaultAsync(ct);


    public async Task<bool> DeleteShipByIdAsync(Guid id, CancellationToken ct)
    {
        var theShipForDeletion = await _dbContext.ShipModel.FirstOrDefaultAsync(del => del.Id == id, ct);

        if (theShipForDeletion is null) return false;


        _dbContext.ShipModel.Remove(theShipForDeletion);
        await _dbContext.SaveChangesAsync(ct);
        await _notifyThat.ShipIsDeleted(id);

        return true;
    }


    public async Task<ShipDto> RegisterNewShipAsync(ShipCreateDto regShipModel)
    {
        var regShip = new ShipModel { Name = regShipModel.Name, HostAddr = regShipModel.HostAddr };
        _dbContext.ShipModel.Add(regShip);
        await _dbContext.SaveChangesAsync();
        
        var regShipDto = new ShipDto
        {
            Id = regShip.Id,
            Name = regShip.Name,
            HostAddr = regShip.HostAddr
        };
        
        
        await _notifyThat.ShipIsCreated(regShipDto);

        return regShipDto;
    }

    public async Task<ShipStatusDto> UpdateShipModelAsync(Guid id, ShipUpdateDto updatedShip,
        CancellationToken ct = default)
    {
        //Normalize inputs
        var newName = updatedShip.Name.Trim();
        var newHostAddr = updatedShip.HostAddr.Trim();

        var current = await _dbContext.ShipModel.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (current == null) throw new KeyNotFoundException($"Ship with ID {id} was not found.");

        // Early‑out if nothing changed (avoid DB round‑trip + SignalR)
        bool nameUnchanged = string.Equals(current.Name, newName, StringComparison.Ordinal);
        bool hostUnchanged = string.Equals(current.HostAddr, newHostAddr, StringComparison.Ordinal);
        if (nameUnchanged && hostUnchanged)
        {
            return MapToShipResult(current);
        }

        //Apply updates
        if (!String.IsNullOrWhiteSpace(updatedShip.Name))
        {
            current.Name = updatedShip.Name.Trim();
            
        }
        
        if (!String.IsNullOrWhiteSpace(updatedShip.HostAddr))
        {
            current.HostAddr = updatedShip.HostAddr.Trim();
            
        }
    
     
        await _dbContext.SaveChangesAsync(ct);
        var currentShipResult = MapToShipResult(current);
        await _notifyThat.ShipIsUpdated(currentShipResult);
        return currentShipResult;
    }


    private ShipStatusDto MapToShipResult(ShipModel ship)
    {
        return new ShipStatusDto()

        {
            Id = ship.Id,
            Name = ship.Name,
            HostAddr = ship.HostAddr,
            Result = _status.GetLatestPingResult(ship.Id)
        };
    }
}