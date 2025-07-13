using PingApp.Models.Dtos;

namespace PingApp.Interfaces;

public interface IShipQueryService
{
    Task<PaginatedDisplay<ShipDto>> GetPaginatedShips(int page, int size, string? search = null, string? sort = null, string? direction = null);
}