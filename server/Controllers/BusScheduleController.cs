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
    [Route("[controller]")]
    [ApiController]
    public class BusScheduleController : ControllerBase
    {
        private readonly BusDbContext _context;

        public BusScheduleController(BusDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusScheduleDTO>>> GetBusSchedules(
            [FromQuery] string startCityName = null,
            [FromQuery] string destinationCityName = null,
            [FromQuery] DateTime? departureDate = null)
        {
            IQueryable<BusSchedule> query = _context.BusSchedules
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.StartCity)
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.DestinationCity)
                .Include(bs => bs.Operator)
                .Include(bs => bs.BusScheduleStops)
                    .ThenInclude(bss => bss.Stop); // Include stops

            if (!string.IsNullOrEmpty(startCityName))
            {
                query = query.Where(bs => bs.BusLine.StartCity.Name == startCityName);
            }

            if (!string.IsNullOrEmpty(destinationCityName))
            {
                query = query.Where(bs => bs.BusLine.DestinationCity.Name == destinationCityName);
            }

            if (departureDate.HasValue)
            {
                query = query.Where(bs => bs.Departure.Date == departureDate.Value.Date);
            }

            // Order by departure time
            query = query.OrderBy(bs => bs.Departure);

            var busSchedules = await query.ToListAsync();

            var busScheduleDTOs = busSchedules.Select(bs => new BusScheduleDTO
            {
                Id = bs.Id, // Fetching the ID property
                StartCityName = bs.BusLine?.StartCity?.Name,
                DestinationCityName = bs.BusLine?.DestinationCity?.Name,
                OperatorName = bs.Operator?.Name,
                Departure = bs.Departure,
                Arrival = bs.Arrival,
                Price = bs.Price,
                // Get station names instead of stop IDs
                StationNames = bs.BusScheduleStops?.Select(bss => bss.Stop.StationName).ToList() ?? new List<string>()
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
                    .ThenInclude(bss => bss.Stop) // Include stops
                .FirstOrDefaultAsync(bs => bs.Id == id);

            if (busSchedule == null)
            {
                return NotFound();
            }

            var busScheduleDTO = new BusScheduleDTO
            {
                Id = busSchedule.Id,
                StartCityName = busSchedule.BusLine?.StartCity?.Name, // Use ?. operator to handle possible null references
                DestinationCityName = busSchedule.BusLine?.DestinationCity?.Name, // Use ?. operator to handle possible null references
                OperatorName = busSchedule.Operator?.Name, // Use ?. operator to handle possible null references
                Departure = busSchedule.Departure,
                Arrival = busSchedule.Arrival,
                Price = busSchedule.Price,
                // Get station names instead of stop IDs
                StationNames = busSchedule.BusScheduleStops?.Select(bss => bss.Stop.StationName).ToList() ?? new List<string>() // Use ?. operator to handle possible null references and provide a default empty list if null
            };

            return busScheduleDTO;
        }


        [HttpPost]
        public async Task<ActionResult<BusScheduleDTO>> AddBusSchedule(BusScheduleDTO busScheduleDTO)
        {
            if (busScheduleDTO.Price <= 0)
            {
                return BadRequest("Price must be greater than 0.");
            }

            var busLine = await _context.BusLines
                .Include(bl => bl.StartCity)
                .Include(bl => bl.DestinationCity)
                .FirstOrDefaultAsync(bl =>
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

            if (busScheduleDTO.StationNames != null)
            {
                foreach (var stationName in busScheduleDTO.StationNames)
                {
                    var stop = await _context.Stops.FirstOrDefaultAsync(s => s.StationName == stationName);
                    if (stop != null)
                    {
                        busSchedule.BusScheduleStops.Add(new BusScheduleStop
                        {
                            StopId = stop.Id
                        });
                    }
                    else
                    {
                        return BadRequest($"Stop with name {stationName} not found.");
                    }
                }
            }

            _context.BusSchedules.Add(busSchedule);
            await _context.SaveChangesAsync();

            // Fetch the start city name and destination city name from the bus line
            var startCityName = busLine.StartCity?.Name;
            var destinationCityName = busLine.DestinationCity?.Name;

            // Construct a new BusScheduleDTO based on the added entity and include the ID
            var addedBusScheduleDTO = new BusScheduleDTO
            {
                Id = busSchedule.Id,
                StartCityName = startCityName,
                DestinationCityName = destinationCityName,
                OperatorName = @operator.Name,
                Departure = busSchedule.Departure,
                Arrival = busSchedule.Arrival,
                Price = busSchedule.Price,
                StationNames = busScheduleDTO.StationNames
            };

            // Return the newly created bus schedule DTO along with its ID
            return CreatedAtAction(nameof(GetBusSchedule), new { id = busSchedule.Id }, addedBusScheduleDTO);
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
            if (busScheduleDTO.Departure != default(DateTime))
            {
                existingBusSchedule.Departure = busScheduleDTO.Departure;
            }

            if (busScheduleDTO.Arrival != default(DateTime))
            {
                existingBusSchedule.Arrival = busScheduleDTO.Arrival;
            }

            if (busScheduleDTO.Price > 0)
            {
                existingBusSchedule.Price = busScheduleDTO.Price;
            }

            // Update operator name if provided
            if (!string.IsNullOrEmpty(busScheduleDTO.OperatorName))
            {
                var operatorEntity = await _context.Operators.FirstOrDefaultAsync(op => op.Name == busScheduleDTO.OperatorName);
                if (operatorEntity != null)
                {
                    existingBusSchedule.Operator = operatorEntity;
                }
                else
                {
                    return BadRequest($"Operator with name {busScheduleDTO.OperatorName} not found.");
                }
            }

            // Clear existing stops and associate the bus schedule with new stops if provided
            existingBusSchedule.BusScheduleStops.Clear();

            if (busScheduleDTO.StationNames != null && busScheduleDTO.StationNames.Any())
            {
                foreach (var stationName in busScheduleDTO.StationNames)
                {
                    var stop = await _context.Stops.FirstOrDefaultAsync(s => s.StationName == stationName);
                    if (stop != null)
                    {
                        existingBusSchedule.BusScheduleStops.Add(new BusScheduleStop
                        {
                            StopId = stop.Id
                        });
                    }
                    else
                    {
                        return BadRequest($"Stop with name {stationName} not found.");
                    }
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
