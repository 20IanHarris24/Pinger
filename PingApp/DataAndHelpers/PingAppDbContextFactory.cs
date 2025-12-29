using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PingApp.DataAndHelpers
{
    public class PingAppDbContextFactory : IDesignTimeDbContextFactory<PingAppDbContext>
    {
        public PingAppDbContext CreateDbContext(string[] args)
        {

            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json")
                .Build();

            var dbConnectionString = config.GetConnectionString("DataBaseConnection");


            var optionsBuilder = new DbContextOptionsBuilder<PingAppDbContext>();
            optionsBuilder.UseSqlite(dbConnectionString);

            return new PingAppDbContext(optionsBuilder.Options);
        }

    }
}