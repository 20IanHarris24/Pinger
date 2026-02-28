

using PingApp.Models.Dtos;

namespace PingApp.Interfaces;

public interface IShipQueryService
{
    Task<PaginatedDisplay<ShipDto>> GetPaginatedShips(int page, int size, string sort, string direction);
    
    Task<IReadOnlyList<ShipDto>> GetAllShipsAsync(CancellationToken ct = default);

    Task<ShipDto?> GetShipByIdAsync(Guid id, CancellationToken ct = default);

    Task<bool> DeleteShipByIdAsync(Guid id, CancellationToken ct);

    Task<ShipDto> RegisterNewShipAsync(ShipCreateDto regShipModel);

    Task<ShipStatusDto> UpdateShipModelAsync(Guid id, ShipUpdateDto updatedShip, CancellationToken ct = default);


}