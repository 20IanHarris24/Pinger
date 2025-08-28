namespace PingApp.DataAndHelpers
{
    public class Ship()
    {
        public Guid? ShipId { get; set; }

        public string? ShipName { get; set; }

        public string? ShipHost { get; set; }


        public Ship(Guid? id, string? name, string? host) : this()
        {
            ShipId = id;
            ShipName = name;
            ShipHost = host;
        }


        public Ship(string? name, string? host) : this()
        {
            ShipName = name;
            ShipHost = host;
        }
    }
}