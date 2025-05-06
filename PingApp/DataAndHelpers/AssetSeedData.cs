using Microsoft.EntityFrameworkCore;
using PingApp.Models.Entities;

namespace PingApp.DataAndHelpers
{
    public class AssetSeedData
    {

            internal async Task InitAsync(PingAppDbContext db,  IConfiguration configuration)
            {

                if (await db.ShipModel.AnyAsync()) return; //This ia a check to see if data exists in the DB. If false ships will be seeded into the dB.


                ShipModel[] ships = SeedShipsDb(configuration);
                // object[] shipObjectsList = ships.Cast<object>().ToArray();
                await db.ShipModel.AddRangeAsync(ships);
                Console.WriteLine($"Ships seeded.....");


                await db.SaveChangesAsync();
                Console.WriteLine("Saving changes to the database.....");
            }


            private static ShipModel[] SeedShipsDb(IConfiguration configuration)
            {

                var shipsConfig = configuration.GetSection("ShipAssetsDb").Get<Ship[]>()!;
                var shipsCollection = new ShipModel[shipsConfig.Length];

                for (int i = 0; i < shipsConfig.Length; i++)
                {

                    shipsCollection[i] = new ShipModel()
                        {
                        Name = shipsConfig[i].ShipName,
                        HostAddr = shipsConfig[i].ShipHost,
                    };

                }

                return shipsCollection;
            }
    }


}