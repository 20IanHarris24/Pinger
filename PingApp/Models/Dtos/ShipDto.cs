using System.ComponentModel.DataAnnotations;

namespace PingApp.Models.Dtos
{
    public class ShipDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Ship name is required")]
        [MaxLength(50, ErrorMessage = "Ship name cannot exceed 50 characters.")]
        public string Name { get; init; } = string.Empty;

        [Required(ErrorMessage = "Host address is required")]
        [MaxLength(50, ErrorMessage = "Host address length cannot exceed 50 characters.")]
        public string HostAddr { get; init; } = string.Empty;
    }
}