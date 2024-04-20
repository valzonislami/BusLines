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


        public DbSet<City> Cities { get; set; }
        public DbSet<Operator> Operators { get; set; }
        public DbSet<BusLine> BusLines { get; set; }
        public DbSet<BusSchedules> BusSchedules { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");

                optionsBuilder.UseSqlServer(connectionString);
            }
    }
}
