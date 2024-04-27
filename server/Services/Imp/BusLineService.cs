using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.DTOs;
using server.Entities;

namespace server.Services
{
    public class BusLineService : IBusLineService
    {
        private readonly BusDbContext _context;

        public BusLineService(BusDbContext context)
        {
            _context = context;
        }

        public async Task<List<BusLine>> GetBusLinesAsync()
        {
            return await _context.BusLines
                .Include(bl => bl.StartCity)
                .Include(bl => bl.DestinationCity)
                .ToListAsync();
        }

        public async Task<BusLine> GetBusLineAsync(int id)
        {
            return await _context.BusLines
                .Include(bl => bl.StartCity)
                .Include(bl => bl.DestinationCity)
                .FirstOrDefaultAsync(bl => bl.Id == id);
        }

        public async Task<BusLine> AddBusLineAsync(BusLineDTO busLineDTO)
        {
            var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.StartCityName);
            var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.DestinationCityName);

            if (startCity == null || destinationCity == null)
            {
                throw new ArgumentException("Invalid start city or destination city name.");
            }

            var busLine = new BusLine
            {
                StartCityId = startCity.Id,
                DestinationCityId = destinationCity.Id
            };

            _context.BusLines.Add(busLine);
            await _context.SaveChangesAsync();

            return busLine;
        }

        public async Task UpdateBusLineAsync(int id, BusLineDTO busLineDTO)
        {
            var existingBusLine = await _context.BusLines.FindAsync(id);
            if (existingBusLine == null)
            {
                throw new KeyNotFoundException($"BusLine with ID {id} not found.");
            }

            var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.StartCityName);
            var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.DestinationCityName);

            if (startCity == null && !string.IsNullOrWhiteSpace(busLineDTO.StartCityName))
            {
                throw new ArgumentException("Start city not found.");
            }

            if (destinationCity == null && !string.IsNullOrWhiteSpace(busLineDTO.DestinationCityName))
            {
                throw new ArgumentException("Destination city not found.");
            }

            existingBusLine.StartCityId = startCity?.Id ?? existingBusLine.StartCityId; // Use null-coalescing for optional assignment
            existingBusLine.DestinationCityId = destinationCity?.Id ?? existingBusLine.DestinationCityId;

            try
            {
                _context.Entry(existingBusLine).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;  // Re-throw the exception for handling in the controller
            }
        }

        public async Task DeleteBusLineAsync(int id)
        {
            var busLine = await _context.BusLines.FindAsync(id);
            if (busLine == null)
            {
                throw new KeyNotFoundException($"BusLine with ID {id} not found.");
            }

            _context.BusLines.Remove(busLine);
            await _context.SaveChangesAsync();
        }
    }
}
