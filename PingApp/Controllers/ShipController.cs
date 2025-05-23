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

            if (allShips.Count == 0)
            {
                return NotFound("No ships found");
            }

            return Ok(allShips);

        }



        [HttpGet("/shipid/{id:guid}")]
        
        public async Task<ActionResult<ShipModel>> GetShipByShipId(Guid id)
        {
            try
            {
                // Fetch ship with the specified name
                var ship = await _shipContext.ShipModel
                    .Where(ship => ship.Id == id)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();


                if (ship == null)
                {
                    return NotFound("No ship found with that specified Id.");
                }
            
                return Ok(ship);
            }
            catch (Exception ex)
            {
                // Log the exception (implement logging as needed)
                _logger.LogError(ex, "Error fetching ship : {id}",id);

                return StatusCode(500, "Internal server error occurred while processing the request.");
            }
        }

        [HttpDelete("/{id:guid}")]
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
        public async Task<ActionResult<ShipNewDto>> RegisterShip([FromBody] ShipNewDto regShipModel)
        {
            var regShip = new ShipModel {Name = regShipModel.Name, HostAddr = regShipModel.HostAddr };
            _shipContext.ShipModel.Add(regShip);
            await _shipContext.SaveChangesAsync();

            return Ok(
            
            new ShipNewDto
            {
                Id = regShip.Id,
                Name = regShip.Name,
                HostAddr = regShip.HostAddr
                    
            });
       }





        [HttpPut("/{id}")]
        public async Task<IActionResult> UpdateShipModel(Guid id, [FromBody] ShipUpdateDto shipModel)
        {
            // if (id != shipModel.)
            // {
            //     return BadRequest();
            // }

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