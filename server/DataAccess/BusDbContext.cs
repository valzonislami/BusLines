using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.DataAccess
{
    public class BusDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public BusDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public DbSet<BusLine> BusLines { get; set; }
        public DbSet<City> Cities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BusLine>()
                .HasOne(bl => bl.StartCity)
                .WithMany()
                .HasForeignKey(bl => bl.StartCityId);

            modelBuilder.Entity<BusLine>()
                .HasOne(bl => bl.DestinationCity)
                .WithMany()
                .HasForeignKey(bl => bl.DestinationCityId);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");

                optionsBuilder.UseSqlServer(connectionString);
            }
    }
}
