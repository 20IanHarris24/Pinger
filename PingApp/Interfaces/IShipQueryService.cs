
using Microsoft.AspNetCore.Mvc;
using PingApp.DataAndHelpers;
using PingApp.Models.Dtos;

namespace PingApp.Interfaces;

public interface IShipQueryService
{
    Task<PaginatedDisplay<ShipDto>> GetPaginatedShips(int page, int size, string? search = null, string? sort = null, string? direction = null);
    
    Task<IReadOnlyList<ShipDto>> GetAllShipsAsync(CancellationToken ct = default);

    Task<ShipDto?> GetShipByIdAsync(Guid id, CancellationToken ct = default);

    Task<bool> DeleteShipByIdAsync(Guid id, CancellationToken ct);

    Task<ShipNewDto> RegisterNewShipAsync(ShipNewDto regShipModel);

    Task<ShipResult> UpdateShipModelAsync(Guid id, ShipUpdateDto updatedShip, CancellationToken ct = default);


}