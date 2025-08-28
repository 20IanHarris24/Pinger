using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Interfaces;
using PingApp.Models.Dtos;
using PingApp.Models.Entities;


namespace PingApp.ServicesBackend;

public class ShipQueryService : IShipQueryService
{
    private readonly IShipStatusService _status;
    private readonly ILogger<ShipQueryService> _logging;
    private readonly NotifierService _notifyThat;
    private readonly PingAppDbContext _dbContext;

    public ShipQueryService(ILogger<ShipQueryService> logger, NotifierService notify, PingAppDbContext context,
        IShipStatusService status)
    {
        _dbContext = context;
        _logging = logger;
        _notifyThat = notify;
        _status = status;
    }


    public async Task<PaginatedDisplay<ShipDto>> GetPaginatedShips(int page, int size, string? search = null,
        string? sort = null, string? direction = null)
    {
        var pageNumber = page < 1 ? 1 : page;
        var pageSize = size > 100 ? 100 : size;

        var dataQuery = _dbContext.ShipModel.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            dataQuery = dataQuery.Where(s => s.Name!.Contains(search));
        }

        dataQuery = (sort!.ToLower(), direction!.ToLower()) switch
        {
            ("name", "desc") => dataQuery.OrderByDescending(s => s.Name),
            ("name", _) => dataQuery.OrderBy(s => s.Name),
            _ => dataQuery.OrderBy(s => s.Name) // default
        };


        var totalCount = await dataQuery.CountAsync();

        var data = await dataQuery
            .Skip((page - 1) * size)
            .Take(size)
            .Select(s => new ShipDto
            {
                Id = s.Id,
                Name = s.Name!,
                HostAddr = s.HostAddr!
            })
            .ToListAsync();

        return new PaginatedDisplay<ShipDto>(data, pageNumber, pageSize, totalCount, sort, direction);
    }


    public async Task<IReadOnlyList<ShipDto>> GetAllShipsAsync(CancellationToken ct = default)
    {
        return await _dbContext.ShipModel
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .Select(s => new ShipDto
            {
                Id = s.Id,
                Name = s.Name!,
                HostAddr = s.HostAddr!
            })
            .ToListAsync(ct);
    }


    public Task<ShipDto?> GetShipByIdAsync(Guid id, CancellationToken ct) =>
        _dbContext.ShipModel
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new ShipDto { Id = s.Id, Name = s.Name!, HostAddr = s.HostAddr! })
            .SingleOrDefaultAsync(ct);


    public async Task<bool> DeleteShipByIdAsync(Guid id, CancellationToken ct)
    {
        var theShipForDeletion = await _dbContext.ShipModel.FirstOrDefaultAsync(del => del.Id == id, ct);

        if (theShipForDeletion is null) return false;


        _dbContext.ShipModel.Remove(theShipForDeletion);
        await _dbContext.SaveChangesAsync(ct);
        var removed = _status.RemoveLatestPingResult(id);

        string removedP = removed ? "cached ping removal SUCCESS" : "cached ping removal FAILED";

        _logging.LogInformation("Attempted to remove ping cache for ship {ShipId}, success: {Removed}", id,
            removedP);

        await _notifyThat.ShipIsDeleted(id);

        return true;
    }


    public async Task<ShipNewDto> RegisterNewShipAsync(ShipNewDto regShipModel)
    {
        var regShip = new ShipModel { Name = regShipModel.Name, HostAddr = regShipModel.HostAddr };
        _dbContext.ShipModel.Add(regShip);
        await _dbContext.SaveChangesAsync();
        await _notifyThat.ShipIsCreated(regShip);

        return new ShipNewDto
        {
            Id = regShip.Id,
            Name = regShip.Name,
            HostAddr = regShip.HostAddr
        };
    }

    public async Task<ShipResult> UpdateShipModelAsync(Guid id, ShipUpdateDto updatedShip,
        CancellationToken ct = default)
    {
        //Normalize inputs
        var newName = updatedShip.Name?.Trim();
        var newHostAddr = updatedShip.HostAddr?.Trim();

        var current = await _dbContext.ShipModel.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (current == null) return null;

        // Early‑out if nothing changed (avoid DB round‑trip + SignalR)
        bool nameUnchanged = string.Equals(current.Name, newName, StringComparison.Ordinal);
        bool hostUnchanged = string.Equals(current.HostAddr, newHostAddr, StringComparison.Ordinal);
        if (nameUnchanged && hostUnchanged)
        {
            return MapToShipResult(current);
        }

        //Apply updates
        current.Name = newName ?? current.Name;
        current.HostAddr = newHostAddr ?? current.HostAddr;


        await _dbContext.SaveChangesAsync(ct);
        var currentShipResult = MapToShipResult(current);
        await _notifyThat.ShipIsUpdated(currentShipResult);
        return currentShipResult;
    }


    private ShipResult MapToShipResult(ShipModel ship)
    {
        return new ShipResult

        {
            Id = ship.Id,
            Name = ship.Name,
            HostAddr = ship.HostAddr,
            Result = _status.GetLatestPingResult(ship.Id)
        };
    }
}