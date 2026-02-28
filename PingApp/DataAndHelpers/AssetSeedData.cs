using Microsoft.EntityFrameworkCore;
using PingApp.Models.Entities;

namespace PingApp.DataAndHelpers
{
    public class AssetSeedData
    {
        private readonly ILogger<AssetSeedData> _logging;
        public AssetSeedData(ILogger<AssetSeedData> log)
        {
            _logging = log;
        }

            internal async Task<bool> InitAsync(CancellationToken ct, IConfiguration configuration, PingAppDbContext db)
            {

                if (await db.ShipModel.AnyAsync(ct))
                {
                    _logging.LogInformation("Seeding skipped: ships already exist in db.");
                    return false; 
                }


                ShipModel[] ships = SeedShipsDb(configuration);

                if (ships.Length == 0)
                {
                   _logging.LogWarning("Seeding skipped: ShipAssetsDb config is empty or missing.");
                    return false;
                }
                
                await db.ShipModel.AddRangeAsync(ships, ct);
                await db.SaveChangesAsync(ct);

                _logging.LogInformation("Seeded {Count} ships into the database.", ships.Length);
                
                return true;

               
            }


            private static ShipModel[] SeedShipsDb(IConfiguration configuration)
            {

                var shipsConfig = configuration.GetSection("ShipAssetsDb").Get<SeedShipConfig[]>() ?? Array.Empty<SeedShipConfig>();
                var shipsCollection = new List<ShipModel>(shipsConfig.Length);

                for (int i = 0; i < shipsConfig.Length; i++)
                {
                    
                    var name = shipsConfig[i].ShipName.Trim();
                    var host = shipsConfig[i].ShipHost.Trim();
                    
                    if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(host))
                        continue;

                    shipsCollection.Add(new ShipModel { Name = name, HostAddr = host });
                    
                }

                return shipsCollection.ToArray();
            }
    }


}