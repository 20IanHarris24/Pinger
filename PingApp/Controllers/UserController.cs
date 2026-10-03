using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PingApp.Models.Entities;

namespace PingApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(ILogger<UserController> logger, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }
        
     
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var existingUser = await _userManager.FindByNameAsync(request.UserName);

            if (existingUser is not null)
            {
                return Conflict("A user with that username already exists.");
            }

            var user = new ApplicationUser
            {
                UserName = request.UserName,
                Email = request.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            var role = request.Role;

            if (role != "Viewer" && role != "Admin")
            {
                await _userManager.DeleteAsync(user);
                return BadRequest("Role must be either Viewer or Admin.");
            }

            var roleResult = await _userManager.AddToRoleAsync(user, role);

            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                return BadRequest(roleResult.Errors.Select(e => e.Description));
            }

            return Ok(new
            {
                user.UserName,
                user.Email,
                Role = role
            });
        }
        
        
        [Authorize(Roles = "Admin")]
        [HttpDelete("{userName}")]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user is null)
            {
                return NotFound();
            }

            if (user.UserName == User.Identity?.Name)
            {
                return BadRequest("You cannot delete the currently logged-in user.");
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            return NoContent();
        }
        
        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task <ActionResult<IEnumerable<UserResponse>>> GetUsers()
        {
            
            var users = _userManager.Users.ToList();
            var response = new List<UserResponse>();
            
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                response.Add(new UserResponse(
                    user.UserName!,
                    user.Email!,
                    roles.FirstOrDefault() ?? string.Empty
                )); 
            }
            return Ok(response);    
       }
        
        
        [Authorize(Roles = "Admin")]
        [HttpPut("{userName}")]
        public async Task<IActionResult> UpdateUser(
            string userName,
            UpdateUserRequest request)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user is null)
            {
                return NotFound();
            }

            if (request.Role != "Viewer" && request.Role != "Admin")
            {
                return BadRequest("Role must be either Viewer or Admin.");
            }
            
            
            var isCurrentUser =
                user.UserName == User.Identity?.Name;

            if (isCurrentUser && request.Role != "Admin")
            {
                return BadRequest(
                    "You cannot remove the Admin role from the currently logged-in user.");
            }

            user.UserName = request.UserName;
            user.Email = request.Email;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                return BadRequest(
                    updateResult.Errors.Select(e => e.Description));
            }

            var currentRoles = await _userManager.GetRolesAsync(user);

            if (!currentRoles.Contains(request.Role))
            {
                if (currentRoles.Any())
                {
                    var removeResult =
                        await _userManager.RemoveFromRolesAsync(
                            user,
                            currentRoles);

                    if (!removeResult.Succeeded)
                    {
                        return BadRequest(
                            removeResult.Errors.Select(e => e.Description));
                    }
                }

                var addResult =
                    await _userManager.AddToRoleAsync(
                        user,
                        request.Role);

                if (!addResult.Succeeded)
                {
                    return BadRequest(
                        addResult.Errors.Select(e => e.Description));
                }
            }

            return Ok();
        }
        
        
        
        
        
        
        public sealed record RegisterRequest(
            string UserName,
            string Email,
            string Password,
            string Role);
        
        
        
        public sealed record UserResponse(
            string UserName,
            string Email,
            string Role);
        
        
        
        public sealed record UpdateUserRequest(
            string UserName,
            string Email,
            string Role);
        
        
        
    }
}