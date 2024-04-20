using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.DTOs;
using server.Entities;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BusLineController : ControllerBase
    {
        private readonly BusDbContext _context;

        public BusLineController(BusDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBusLines()
        {
            var busLines = await _context.BusLines
                .Include(bl => bl.StartCity) // Include the StartCity entity
                .Include(bl => bl.DestinationCity) // Include the DestinationCity entity
                .ToListAsync();

            return Ok(busLines);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBusLine(int id)
        {
            var busLine = await _context.BusLines
                .Include(bl => bl.StartCity) // Include the StartCity entity
                .Include(bl => bl.DestinationCity) // Include the DestinationCity entity
                .FirstOrDefaultAsync(bl => bl.Id == id);

            if (busLine == null)
            {
                return NotFound();
            }

            return Ok(busLine);
        }

        [HttpPost]
        public async Task<IActionResult> AddBusLine([FromBody] BusLineDTO busLineDTO)
        {
            // Check if the provided city names exist in the database
            var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.StartCityName);
            var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.DestinationCityName);

            if (startCity == null || destinationCity == null)
            {
                return BadRequest("Invalid start city or destination city name.");
            }

            // Create a new BusLine object
            var busLine = new BusLine
            {
                StartCityId = startCity.Id,
                DestinationCityId = destinationCity.Id
            };

            // Add the new BusLine to the context and save changes
            _context.BusLines.Add(busLine);
            await _context.SaveChangesAsync();

            // Return a 201 Created status with the newly created bus line
            return CreatedAtAction(nameof(GetBusLine), new { id = busLine.Id }, busLine);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBusLine(int id, [FromBody] BusLineDTO busLineDTO)
        {
            // Find the existing bus line by ID
            var existingBusLine = await _context.BusLines.FindAsync(id);
            if (existingBusLine == null)
            {
                return NotFound();
            }

            // Get the city IDs from the provided city names
            var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.StartCityName);
            var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.DestinationCityName);

            if (startCity == null && !string.IsNullOrWhiteSpace(busLineDTO.StartCityName))
            {
                // If the start city name is provided but not found in the database, return a BadRequest response
                return BadRequest("Start city not found.");
            }

            if (destinationCity == null && !string.IsNullOrWhiteSpace(busLineDTO.DestinationCityName))
            {
                // If the destination city name is provided but not found in the database, return a BadRequest response
                return BadRequest("Destination city not found.");
            }

            // Update only the provided properties if they are not null or whitespace
            if (!string.IsNullOrWhiteSpace(busLineDTO.StartCityName))
            {
                existingBusLine.StartCityId = startCity.Id;
            }

            if (!string.IsNullOrWhiteSpace(busLineDTO.DestinationCityName))
            {
                existingBusLine.DestinationCityId = destinationCity.Id;
            }

            try
            {
                // Update the state of the existing bus line and save changes
                _context.Entry(existingBusLine).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusLineExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusLine(int id)
        {
            var busLine = await _context.BusLines.FindAsync(id);
            if (busLine == null)
            {
                return NotFound();
            }

            _context.BusLines.Remove(busLine);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BusLineExists(int id)
        {
            return _context.BusLines.Any(e => e.Id == id);
        }
    }
}
