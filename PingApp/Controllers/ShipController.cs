
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Models.Dtos;
using PingApp.Models.Entities;
using PingApp.ServicesBackend;

namespace PingApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ShipController : ControllerBase

    {
        private readonly ILogger<ShipController> _logger;
        private readonly PingAppDbContext _shipContext;
        private readonly NotifierService _notifyThat;
        private readonly ShipStatusService _service;


        public ShipController(ILogger<ShipController> logger, NotifierService notify, PingAppDbContext context, ShipStatusService shipStatusService)   
        {
            _logger = logger;
            _notifyThat = notify;
            _shipContext = context;
            _service = shipStatusService;
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
            _service.RemoveLatestPingResult(id);
            await _notifyThat.ShipIsDeleted(id);

            return NoContent();
        }

        [HttpPost("/register")]
        public async Task<ActionResult<ShipNewDto>> RegisterShip([FromBody] ShipNewDto regShipModel)
        {
            var regShip = new ShipModel {Name = regShipModel.Name, HostAddr = regShipModel.HostAddr };
            _shipContext.ShipModel.Add(regShip);
            await _shipContext.SaveChangesAsync();
            await _notifyThat.ShipIsCreated(regShip);

            return Ok(
            
            new ShipNewDto
            {
                Id = regShip.Id,
                Name = regShip.Name,
                HostAddr = regShip.HostAddr
                    
            });
       }


        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ShipResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<ShipResult>> UpdateShipModel(Guid id, [FromBody] ShipUpdateDto updatedShip)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ShipModel? current = await _shipContext.ShipModel.FirstOrDefaultAsync(sm => sm.Id == id);
            

            if (current == null)
            {
                return NotFound();
            }

            current.Name = updatedShip.Name;
            current.HostAddr = updatedShip.HostAddr;

            _shipContext.Entry(current).State = EntityState.Modified;

            try
            {
                
                await _shipContext.SaveChangesAsync();
                
                var currentShipResult = MapToShipResult(current);
                
                await _notifyThat.ShipIsUpdated(currentShipResult);
                
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _shipContext.ShipModel.AnyAsync(sm => sm.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(current);

            // return Ok( new
            // {
            //     Message = "Ship object updated successfully",
            //     Data = current
            //
            // });
        }
        
        
        
        
        public ShipResult MapToShipResult(ShipModel ship)
        {
            return new ShipResult
        
            {
                Id = ship.Id,
                Name = ship.Name,
                HostAddr = ship.HostAddr,
                Result = _service.GetLatestPingResult(ship.Id)
            };
    
        }
        
        
        

      
    }
}