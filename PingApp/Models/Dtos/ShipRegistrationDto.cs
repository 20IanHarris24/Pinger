using System.ComponentModel.DataAnnotations;

namespace PingApp.Models.Dtos
{
    public class ShipRegistrationDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Ship name is required")]
        [MaxLength(50, ErrorMessage = "Ship name cannot exceed 50 characters.")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Host address is required")]
        [MaxLength(50, ErrorMessage = "Host address length cannot exceed 50 characters.")]
        public string? HostAddr { get; set; }
    }
}