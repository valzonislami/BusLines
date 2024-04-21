using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Models;
using server.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
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
                .Select(s => new StopDTO
                {
                    Id = s.Id,
                    CityId = s.CityId,
                    // Map other properties as needed
                    BusScheduleIds = s.BusScheduleStops.Select(bss => bss.BusScheduleId).ToList()
                })
                .ToListAsync();

            return stops;
        }

        // GET: api/Stop/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StopDTO>> GetStop(int id)
        {
            var stop = await _context.Stops.FindAsync(id);

            if (stop == null)
            {
                return NotFound();
            }

            var stopDTO = new StopDTO
            {
                Id = stop.Id,
                CityId = stop.CityId,
                // Map other properties as needed
                BusScheduleIds = stop.BusScheduleStops.Select(bss => bss.BusScheduleId).ToList()
            };

            return stopDTO;
        }

        // POST: api/Stop
        [HttpPost]
        public async Task<ActionResult<StopDTO>> PostStop(StopDTO stopDTO)
        {
            var stop = new Stop
            {
                CityId = stopDTO.CityId,
                // Map other properties as needed
            };

            _context.Stops.Add(stop);
            await _context.SaveChangesAsync();

            // Associate the stop with bus schedules
            if (stopDTO.BusScheduleIds != null && stopDTO.BusScheduleIds.Any())
            {
                foreach (var busScheduleId in stopDTO.BusScheduleIds)
                {
                    _context.BusScheduleStops.Add(new BusScheduleStop
                    {
                        StopId = stop.Id,
                        BusScheduleId = busScheduleId
                    });
                }

                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetStop), new { id = stop.Id }, stopDTO);
        }


        // PUT: api/Stop/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStop(int id, StopDTO stopDTO)
        {
            if (id != stopDTO.Id)
            {
                return BadRequest();
            }

            var stop = await _context.Stops
                .Include(s => s.BusScheduleStops) // Include the BusScheduleStops navigation property
                .FirstOrDefaultAsync(s => s.Id == id);

            if (stop == null)
            {
                return NotFound();
            }

            stop.CityId = stopDTO.CityId;
            // Map other properties as needed

            // Clear existing associations with bus schedules
            stop.BusScheduleStops.Clear();

            // Associate with the new bus schedules provided in stopDTO.BusScheduleIds
            if (stopDTO.BusScheduleIds != null)
            {
                foreach (var busScheduleId in stopDTO.BusScheduleIds)
                {
                    var busSchedule = await _context.BusSchedules.FindAsync(busScheduleId);
                    if (busSchedule != null)
                    {
                        stop.BusScheduleStops.Add(new BusScheduleStop
                        {
                            BusScheduleId = busScheduleId,
                            StopId = stop.Id
                        });
                    }
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StopExists(id))
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