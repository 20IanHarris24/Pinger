namespace PingApp.Models.Dtos
{
    public class ShipUpdateDto
    {
        public Guid Id { get; init; }
        public string? Name { get; init; } = string.Empty;
        public string? HostAddr { get; init; } = string.Empty;
    }
}