#nullable disable
using Microsoft.EntityFrameworkCore;
using PingApp.Models.Entities;

namespace PingApp.DataAndHelpers
{
    public class PingAppDbContext: DbContext
    {

            public PingAppDbContext(DbContextOptions<PingAppDbContext> options) : base(options){}

            public DbSet<ShipModel> ShipModel { get; set; }

            // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            // {
            //     if (!optionsBuilder.IsConfigured)
            //     {
            //         optionsBuilder.UseNpgsql("DatabaseConnection");
            //     }
            // }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);

                modelBuilder.Entity<ShipModel>().ToTable("Ships");
                // modelBuilder.Entity<ShipModel>().HasKey(s => s.Id);
                modelBuilder.Entity<ShipModel>().Property(s => s.Name).HasMaxLength(50).IsRequired();
                modelBuilder.Entity<ShipModel>().Property(s => s.HostAddr).HasMaxLength(50).IsRequired();

            }

    }
}