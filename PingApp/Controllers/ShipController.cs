using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PingApp.DataAndHelpers;
using PingApp.Interfaces;
using PingApp.Models.Dtos;


namespace PingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShipController : ControllerBase

    {
        private readonly ILogger<ShipController> _logging;
        private readonly IShipPingRequester _pingRequester;
        private readonly IShipQueryService _query;
        


        public ShipController(ILogger<ShipController> logger, IShipPingRequester pingRequester ,IShipQueryService query)
        {
            _logging = logger;
            _pingRequester = pingRequester;
            _query = query;
        }

        [Authorize]
        [HttpGet]
        [Route("all")]
        public async Task<ActionResult<IEnumerable<ShipDto>>> GetAllShips(CancellationToken ct = default)
        {
            var allShips = await _query.GetAllShipsAsync(ct);

            return Ok(allShips);
        }


        [Authorize]
        [HttpGet]
        [Route("{id:guid}")]
        public async Task<ActionResult<ShipDto>> GetShipById(Guid id, CancellationToken ct)
        {
            try
            {
                var ship = await _query.GetShipByIdAsync(id, ct);
                return ship == null ? NotFound() : Ok(ship);
            }

            catch (Exception ex)
            {
                // Log the exception (implement logging as needed)
                _logging.LogError(ex, "Error fetching ship : {id}", id);

                return StatusCode(500, "Internal server error occurred while processing the request.");
            }
        }


        [Authorize]
        [HttpGet]
        [Route("paginated")]
        public async Task<ActionResult<PaginatedDisplay<ShipDto>>> GetPaginationResult([FromQuery] int? page,
            [FromServices] IOptionsSnapshot<PaginationSettings> opts)
        {
            var defaultParam = opts.Value;
            var pageSelected = page ?? defaultParam.Page;

            var paginatedDisplayResult = await _query.GetPaginatedShips(
                pageSelected, defaultParam.PageSize, defaultParam.Sort, defaultParam.Direction);

            return Ok(paginatedDisplayResult);
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> DeleteShip(Guid id, CancellationToken ct) =>
            await _query.DeleteShipByIdAsync(id, ct) ? NoContent() : NotFound();


        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<ShipDto>> RegisterShip([FromBody] ShipCreateDto regShipModel)
        {
            var createdShip = await _query.RegisterNewShipAsync(regShipModel);
            return Ok(createdShip);
        }


        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("update/{id}")]
        [ProducesResponseType(typeof(ShipStatusDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ShipStatusDto>> UpdateShipModel(Guid id, [FromBody] ShipUpdateDto updatedShip,
            CancellationToken ct)
        {
            try
            {
                var updated = await _query.UpdateShipModelAsync(id, updatedShip, ct);
                await _pingRequester.PingNowAsync(id, ct);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
              
            }

        }
    }
}