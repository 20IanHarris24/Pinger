using System.ComponentModel.DataAnnotations;

namespace PingApp.Models.Entities
{
    public class ShipModel
    {

        public Guid Id { get; init; }
        [Required]
        public string? Name { get; set; } = String.Empty;
        [Required]
        public string? HostAddr { get; set; } = String.Empty;

    }


}