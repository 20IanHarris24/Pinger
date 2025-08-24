
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PingApp.DataAndHelpers;
using PingApp.Interfaces;
using PingApp.Models.Dtos;
using PingApp.Models.Entities;
using PingApp.ServicesBackend;

namespace PingApp.Controllers
{
    [ApiController]
    [Route("api/ship")]
    public class ShipController : ControllerBase

    {
        private readonly ILogger<ShipController> _logging;
        private readonly PingAppDbContext _dbContext;
        private readonly NotifierService _notifyThat;
        private readonly IShipQueryService _query;
        private readonly IShipStatusService _status;
        

        public ShipController(ILogger<ShipController> logger, NotifierService notify, PingAppDbContext context, IShipQueryService query, IShipStatusService status)   
        {
            _logging = logger;
            _notifyThat = notify;
            _dbContext = context;
            _query = query;
            _status = status;
            
        }


        [HttpGet]
        [Route("get/all")]
        public async Task <ActionResult<IEnumerable<ShipDto>>> GetAllShips()
        {
            var allShips = await _dbContext.ShipModel.ToListAsync();
            List <ShipDto> shipDtos = new List<ShipDto>();
                
            if (allShips.Count == 0)
            {
                return NotFound("No ships found");
            }

            foreach (var ship in allShips)
            {
                var shipDtoConvert = new ShipDto
                {
                    Id = ship.Id,
                    Name = ship.Name!,
                    HostAddr = ship.HostAddr!
                };
                    

                shipDtos.Add(shipDtoConvert);
            }

            return Ok(shipDtos);

        }



        [HttpGet]
        [Route("get/{id:guid}")]
        
        public async Task<ActionResult<ShipDto>> GetShipById(Guid id)
        {
            try
            {
                // Fetch ship with the specified id
                var ship = await _dbContext.ShipModel
                    .Where(ship => ship.Id == id)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();


                if (ship == null)
                {
                    return NotFound("No ship found with that specified Id.");
                }
                
               
                // return Ok(ship);
                return Ok(new ShipDto  { Id = ship.Id, Name = ship.Name!, HostAddr = ship.HostAddr! });
            }
            catch (Exception ex)
            {
                // Log the exception (implement logging as needed)
                _logging.LogError(ex, "Error fetching ship : {id}",id);

                return StatusCode(500, "Internal server error occurred while processing the request.");
            }
        }
        
       
        
        [HttpGet]
        [Route("get/paginated")]
        public async Task<ActionResult<PaginatedDisplay<ShipDto>>> GetPaginationResult(int page = 1, int size = 18, string? search = null, string sort = "name",
            string direction = "asc")
        {
            var paginatedDisplayResult = await _query.GetPaginatedShips(page, size, search, sort, direction);
            return Ok(paginatedDisplayResult);
        }

       

        [HttpDelete]
        [Route("delete/{id:guid}")]
        public async Task<IActionResult> DeleteShip(Guid id)
        {
            var theShipSelectedForDeletion = await _dbContext.ShipModel.FindAsync(id);
            if (theShipSelectedForDeletion == null)
            {
                return NotFound();
            }

            _dbContext.ShipModel.Remove(theShipSelectedForDeletion);
            
            await  _dbContext.SaveChangesAsync();
            
            var removed = _status.RemoveLatestPingResult(id);

            string removedP = removed ? "cached ping removal SUCCESS" : "cached ping removal FAILED";
            
            _logging.LogInformation("Attempted to remove ping cache for ship {ShipId}, success: {Removed}", id, removedP);
            
            await _notifyThat.ShipIsDeleted(id);
            
            return NoContent();

        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<ShipNewDto>> RegisterShip([FromBody] ShipNewDto regShipModel)
        {
            var regShip = new ShipModel {Name = regShipModel.Name, HostAddr = regShipModel.HostAddr };
            _dbContext.ShipModel.Add(regShip);
            await _dbContext.SaveChangesAsync();
            await _notifyThat.ShipIsCreated(regShip);

            return Ok(
            
            new ShipNewDto
            {
                Id = regShip.Id,
                Name = regShip.Name,
                HostAddr = regShip.HostAddr
                    
            });
       }


        [HttpPut]
        [Route ("update/{id}")]
        [ProducesResponseType(typeof(ShipResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<ShipResult>> UpdateShipModel(Guid id, [FromBody] ShipUpdateDto updatedShip)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ShipModel? current = await _dbContext.ShipModel.FirstOrDefaultAsync(sm => sm.Id == id);
            

            if (current == null)
            {
                return NotFound();
            }

            current.Name = updatedShip.Name;
            current.HostAddr = updatedShip.HostAddr;

            _dbContext.Entry(current).State = EntityState.Modified;

            try
            {
                
                await _dbContext.SaveChangesAsync();
                
                var currentShipResult = MapToShipResult(current);
                
                await _notifyThat.ShipIsUpdated(currentShipResult);
                
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _dbContext.ShipModel.AnyAsync(sm => sm.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Ok(current);
           
        }
        
        
        
        
        public ShipResult MapToShipResult(ShipModel ship)
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
}