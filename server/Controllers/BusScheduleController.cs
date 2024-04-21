using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BusScheduleController : ControllerBase
    {
        private readonly BusDbContext _context;

        public BusScheduleController(BusDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBusSchedules()
        {
            var busSchedules = await _context.BusSchedules
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.StartCity)
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.DestinationCity)
                .Include(bs => bs.Operator)
                .ToListAsync();

            return Ok(busSchedules);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBusSchedule(int id)
        {
            var busSchedule = await _context.BusSchedules
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.StartCity)
                .Include(bs => bs.BusLine)
                    .ThenInclude(bl => bl.DestinationCity)
                .Include(bs => bs.Operator)
                .FirstOrDefaultAsync(bs => bs.Id == id);

            if (busSchedule == null)
            {
                return NotFound();
            }

            return Ok(busSchedule);
        }


        [HttpPost]
        public async Task<IActionResult> AddBusSchedule([FromBody] BusScheduleDTO busScheduleDTO)
        {
            var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busScheduleDTO.StartCityName);
            var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busScheduleDTO.DestinationCityName);

            if (startCity == null || destinationCity == null)
            {
                return BadRequest("Invalid start city or destination city.");
            }

            var busLine = await _context.BusLines.FirstOrDefaultAsync(bl =>
                bl.StartCityId == startCity.Id && bl.DestinationCityId == destinationCity.Id);

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
                BusLine = busLine,
                OperatorId = @operator.Id,
                Operator = @operator,
                Departure = busScheduleDTO.Departure,
                Arrival = busScheduleDTO.Arrival,
                Price = busScheduleDTO.Price
            };

            _context.BusSchedules.Add(busSchedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBusSchedule), new { id = busSchedule.Id }, busSchedule);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBusSchedule(int id, [FromBody] BusScheduleDTO busScheduleDTO)
        {
            var existingBusSchedule = await _context.BusSchedules.FindAsync(id);
            if (existingBusSchedule == null)
            {
                return NotFound();
            }

            // Update only if the corresponding properties in the DTO are not null or empty
            if (!string.IsNullOrWhiteSpace(busScheduleDTO.StartCityName))
            {
                var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busScheduleDTO.StartCityName);
                if (startCity == null)
                {
                    return BadRequest("Invalid start city.");
                }
                existingBusSchedule.BusLine.StartCityId = startCity.Id;
            }

            if (!string.IsNullOrWhiteSpace(busScheduleDTO.DestinationCityName))
            {
                var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busScheduleDTO.DestinationCityName);
                if (destinationCity == null)
                {
                    return BadRequest("Invalid destination city.");
                }
                existingBusSchedule.BusLine.DestinationCityId = destinationCity.Id;
            }

            if (!string.IsNullOrWhiteSpace(busScheduleDTO.OperatorName))
            {
                var @operator = await _context.Operators.FirstOrDefaultAsync(op => op.Name == busScheduleDTO.OperatorName);
                if (@operator == null)
                {
                    return BadRequest("Operator not found.");
                }
                existingBusSchedule.OperatorId = @operator.Id;
            }

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

            _context.Entry(existingBusSchedule).State = EntityState.Modified;
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
