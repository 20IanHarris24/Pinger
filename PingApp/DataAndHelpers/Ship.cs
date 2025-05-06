namespace PingApp.DataAndHelpers
{
    public class Ship()
    {
        public Guid? ShipId
        {
            get;
            set;
        }

        public string? ShipName
        {
            get;
            set;
        }

        public string? ShipHost
        {
            get;
            set;
        }


       public Ship(Guid? id, string? name, string? host) : this()
        {
            this.ShipId = id;
            this.ShipName = name;
            this.ShipHost = host;
        }


        public Ship(string? name, string? host) : this()
        {
            this.ShipName = name;
            this.ShipHost = host;
        }

    }



    internal class ShipSeed
    {

       private readonly Ship[] _shipsConfig;
       private readonly Ship[]? _shipsCollection;


       public Ship[] SeedShips
       {
           get
           {
               return _shipsCollection;
           }
       }



       public ShipSeed(IConfiguration configuration)
       {
          _shipsConfig = configuration.GetSection("ShipAssets").Get<Ship[]>()!;
          _shipsCollection = new Ship[_shipsConfig.Length];

         for (int i = 0; i < _shipsConfig.Length; i++)
         {

             _shipsCollection[i] = new Ship(
                 _shipsConfig[i].ShipId,
                 _shipsConfig[i].ShipName,
                 _shipsConfig[i].ShipHost
             );


         }

       }

    }

}