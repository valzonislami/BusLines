using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Models;
using server.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.DTOs;

namespace server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StopController : ControllerBase
    {
        private readonly BusDbContext _context;

        public StopController(BusDbContext context)
        {
            _context = context;
        }

        // GET: api/Stop
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StopDTO>>> GetStops()
        {
            var stops = await _context.Stops
                .Include(s => s.City)
                .Select(s => new StopDTO
                {
                    Id = s.Id,
                    StationName = s.StationName,
                    CityName = s.City.Name,
                    BusScheduleIds = s.BusScheduleStops.Select(bss => bss.BusScheduleId).ToList()
                })
                .ToListAsync();

            return stops;
        }

        // GET: api/Stop/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StopDTO>> GetStop(int id)
        {
            var stop = await _context.Stops
                .Include(s => s.City)
                .Include(s => s.BusScheduleStops) // Include BusScheduleStops navigation property
                .FirstOrDefaultAsync(s => s.Id == id);

            if (stop == null)
            {
                return NotFound();
            }

            var stopDTO = new StopDTO
            {
                Id = stop.Id,
                StationName = stop.StationName,
                CityName = stop.City.Name,
                BusScheduleIds = stop.BusScheduleStops?.Select(bss => bss.BusScheduleId).ToList() ?? new List<int>() // Use null conditional operator to handle null BusScheduleStops
            };

            return stopDTO;
        }


        // POST: api/Stop
        [HttpPost]
        public async Task<ActionResult<StopDTO>> PostStop(StopPostDTO stopDTO)
        {
            var city = await _context.Cities.FirstOrDefaultAsync(c => c.Name == stopDTO.CityName);
            if (city == null)
            {
                // City not found, return BadRequest
                return BadRequest("City not found");
            }

            var stop = new Stop
            {
                CityId = city.Id,
                StationName = stopDTO.StationName
            };

            _context.Stops.Add(stop);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStop), new { id = stop.Id }, new StopDTO
            {
                Id = stop.Id,
                StationName = stop.StationName,
                CityName = city.Name
            });
        }


        // PUT: api/Stop/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStop(int id, [FromBody] StopPostDTO stopDto)
        {
            var existingStop = await _context.Stops.FindAsync(id);

            if (existingStop == null)
            {
                return NotFound();
            }

            // Fetch CityName through CityId from City Entity
            var cityName = await _context.Cities.FirstOrDefaultAsync(c => c.Name == stopDto.CityName);

            if (cityName == null)
            {
                // Handle if the city is not found for the given CityId
                return NotFound("City not found for the given CityId");
            }
            if (!string.IsNullOrWhiteSpace(stopDto.CityName))
            {
                existingStop.CityId = cityName.Id;
            }

            existingStop.StationName = stopDto.StationName;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // DELETE: api/Stop/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStop(int id)
        {
            var stop = await _context.Stops.FindAsync(id);
            if (stop == null)
            {
                return NotFound();
            }

            _context.Stops.Remove(stop);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StopExists(int id)
        {
            return _context.Stops.Any(e => e.Id == id);
        }
    }
}
