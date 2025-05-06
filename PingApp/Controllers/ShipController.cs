using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Models.Dtos;
using PingApp.Models.Entities;

namespace PingApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ShipController : ControllerBase

    {
        private readonly PingAppDbContext _shipContext;
        private readonly ILogger<ShipController> _logger;


        public ShipController(PingAppDbContext shipContext,  ILogger<ShipController> logger)
        {

            _shipContext = shipContext;
            _logger = logger;
        }


        [HttpGet]
        [Route("/all_ships")]
        public async Task <ActionResult<IEnumerable<ShipModel>>> GetAllShips()
        {
            var allShips = await _shipContext.ShipModel.ToListAsync();

            if (allShips == null || allShips.Count == 0)
            {
                return NotFound("No ships found");
            }

            return Ok(allShips);

        }



        [HttpGet("/shipid/{id}")]
        public async Task<ActionResult<IEnumerable<ShipModel>>> GetShipsByShipId(Guid id)
        {
            try
            {
                // Fetch ship with the specified name
                var ship = await _shipContext.ShipModel
                    .Where(ship => ship.Id == id)
                    .AsNoTracking()
                    .ToListAsync();


                if (!ship.Any())
                {
                    return NotFound("No ship found with that specified name.");
                }

                return Ok(ship);
            }
            catch (Exception ex)
            {
                // Log the exception (implement logging as needed)
                _logger.LogError(ex, "Error fetching ship {shipId}", id);

                return StatusCode(500, "Internal server error occurred while processing the request.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShip(Guid id)
        {
            var selectedShip = await _shipContext.ShipModel.FindAsync(id);
            if (selectedShip == null)
            {
                return NotFound();
            }

            _shipContext.ShipModel.Remove(selectedShip);

            await  _shipContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("/register")]
        public async Task<ActionResult<ShipModel>> RegisterShip(ShipModel regShipModel)
        {
            var regShip = new ShipModel {Name = regShipModel.Name, HostAddr = regShipModel.HostAddr };
            _shipContext.ShipModel.Add(regShip);
            await _shipContext.SaveChangesAsync();

            return Ok(regShip);
        }





        [HttpPut("/{id}")]
        public async Task<IActionResult> UpdateShipModel( Guid id, [FromBody] ShipUpdateDto shipModel)
        {
            if (id != shipModel.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var current = await _shipContext.ShipModel.FirstOrDefaultAsync(sm => sm.Id == id);

            if (current == null)
            {
                return NotFound();
            }

            current.Name = shipModel.Name;
            current.HostAddr = shipModel.HostAddr;

            _shipContext.Entry(current).State = EntityState.Modified;

            await _shipContext.SaveChangesAsync();


            return Ok(new
            {
                Message = "Ship object updated successfully",
                Data = current

            });
        }






    }
}