using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusScheduleController : ControllerBase
    {
        private readonly BusDbContext _context;

        public BusScheduleController(BusDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusScheduleDTO>>> GetBusSchedules()
        {
            var busSchedules = await _context.BusSchedules
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.StartCity) // Include the start city
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.DestinationCity) // Include the destination city
                .Include(bs => bs.Operator)
                .Include(bs => bs.BusScheduleStops)
                .ToListAsync();

            var busScheduleDTOs = busSchedules.Select(bs => new BusScheduleDTO
            {
                StartCityName = bs.BusLine?.StartCity?.Name, // Use ?. operator to handle possible null references
                DestinationCityName = bs.BusLine?.DestinationCity?.Name, // Use ?. operator to handle possible null references
                OperatorName = bs.Operator?.Name, // Use ?. operator to handle possible null references
                Departure = bs.Departure,
                Arrival = bs.Arrival,
                Price = bs.Price,
                StopIds = bs.BusScheduleStops?.Select(bss => bss.StopId).ToList() ?? new List<int>() // Use ?. operator to handle possible null references and provide a default empty list if null
            }).ToList();

            return busScheduleDTOs;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BusScheduleDTO>> GetBusSchedule(int id)
        {
            var busSchedule = await _context.BusSchedules
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.StartCity) // Include the start city
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.DestinationCity) // Include the destination city
                .Include(bs => bs.Operator)
                .Include(bs => bs.BusScheduleStops)
                .FirstOrDefaultAsync(bs => bs.Id == id);

            if (busSchedule == null)
            {
                return NotFound();
            }

            var busScheduleDTO = new BusScheduleDTO
            {
                StartCityName = busSchedule.BusLine?.StartCity?.Name, // Use ?. operator to handle possible null references
                DestinationCityName = busSchedule.BusLine?.DestinationCity?.Name, // Use ?. operator to handle possible null references
                OperatorName = busSchedule.Operator?.Name, // Use ?. operator to handle possible null references
                Departure = busSchedule.Departure,
                Arrival = busSchedule.Arrival,
                Price = busSchedule.Price,
                StopIds = busSchedule.BusScheduleStops?.Select(bss => bss.StopId).ToList() ?? new List<int>() // Use ?. operator to handle possible null references and provide a default empty list if null
            };

            return busScheduleDTO;
        }

        [HttpPost]
        public async Task<ActionResult<BusScheduleDTO>> AddBusSchedule(BusScheduleDTO busScheduleDTO)
        {
            var busLine = await _context.BusLines.FirstOrDefaultAsync(bl =>
                bl.StartCity.Name == busScheduleDTO.StartCityName &&
                bl.DestinationCity.Name == busScheduleDTO.DestinationCityName);

            if (busLine == null)
            {
                return BadRequest("Bus line not found for the specified cities.");
            }

            var @operator = await _context.Operators.FirstOrDefaultAsync(op => op.Name == busScheduleDTO.OperatorName);

            if (@operator == null)
            {
                return BadRequest("Operator not found.");
            }

            var busSchedule = new BusSchedule
            {
                BusLineId = busLine.Id,
                OperatorId = @operator.Id,
                Departure = busScheduleDTO.Departure,
                Arrival = busScheduleDTO.Arrival,
                Price = busScheduleDTO.Price,
                BusScheduleStops = new List<BusScheduleStop>()
            };

            if (busScheduleDTO.StopIds != null)
            {
                foreach (var stopId in busScheduleDTO.StopIds)
                {
                    var stop = await _context.Stops.FindAsync(stopId);
                    if (stop != null)
                    {
                        busSchedule.BusScheduleStops.Add(new BusScheduleStop
                        {
                            StopId = stopId
                        });
                    }
                    else
                    {
                        return BadRequest($"Stop with ID {stopId} not found.");
                    }
                }
            }

            _context.BusSchedules.Add(busSchedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBusSchedule), new { id = busSchedule.Id }, busScheduleDTO);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBusSchedule(int id, BusScheduleDTO busScheduleDTO)
        {
            var existingBusSchedule = await _context.BusSchedules
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.StartCity)
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.DestinationCity)
                .Include(bs => bs.Operator)
                .Include(bs => bs.BusScheduleStops)
                .FirstOrDefaultAsync(bs => bs.Id == id);

            if (existingBusSchedule == null)
            {
                return NotFound();
            }

            // Update departure, arrival, and price if provided
            if (busScheduleDTO.Departure != null)
            {
                existingBusSchedule.Departure = busScheduleDTO.Departure;
            }

            if (busScheduleDTO.Arrival != null)
            {
                existingBusSchedule.Arrival = busScheduleDTO.Arrival;
            }

            if (busScheduleDTO.Price != null)
            {
                existingBusSchedule.Price = busScheduleDTO.Price;
            }

            // Update start city if provided
            if (!string.IsNullOrWhiteSpace(busScheduleDTO.StartCityName))
            {
                var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busScheduleDTO.StartCityName);
                if (startCity == null)
                {
                    return BadRequest("Start city not found.");
                }
                existingBusSchedule.BusLine.StartCityId = startCity.Id;
            }

            // Update destination city if provided
            if (!string.IsNullOrWhiteSpace(busScheduleDTO.DestinationCityName))
            {
                var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busScheduleDTO.DestinationCityName);
                if (destinationCity == null)
                {
                    return BadRequest("Destination city not found.");
                }
                existingBusSchedule.BusLine.DestinationCityId = destinationCity.Id;
            }

            // Update operator if provided
            if (!string.IsNullOrWhiteSpace(busScheduleDTO.OperatorName))
            {
                var @operator = await _context.Operators.FirstOrDefaultAsync(op => op.Name == busScheduleDTO.OperatorName);
                if (@operator == null)
                {
                    return BadRequest("Operator not found.");
                }
                existingBusSchedule.OperatorId = @operator.Id;
            }

            // Clear existing stops and associate the bus schedule with new stops if provided
            existingBusSchedule.BusScheduleStops.Clear();

            if (busScheduleDTO.StopIds != null && busScheduleDTO.StopIds.Any())
            {
                foreach (var stopId in busScheduleDTO.StopIds)
                {
                    existingBusSchedule.BusScheduleStops.Add(new BusScheduleStop
                    {
                        StopId = stopId
                    });
                }
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusSchedule(int id)
        {
            var busSchedule = await _context.BusSchedules.FindAsync(id);
            if (busSchedule == null)
            {
                return NotFound();
            }

            _context.BusSchedules.Remove(busSchedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
