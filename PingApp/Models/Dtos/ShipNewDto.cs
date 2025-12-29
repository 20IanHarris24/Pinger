using System.ComponentModel.DataAnnotations;

namespace PingApp.Models.Dtos
{
    public class ShipNewDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Ship name is required")]
        [MaxLength(50, ErrorMessage = "Ship name cannot exceed 50 characters.")]
        public string Name { get; init; } = String.Empty;

        [Required(ErrorMessage = "Host address is required")]
        [MaxLength(50, ErrorMessage = "Host address length cannot exceed 50 characters.")]
        public string HostAddr { get; init; } = String.Empty;
    }
}