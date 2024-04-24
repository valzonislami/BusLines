using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly BusDbContext _context;

        public TicketController(BusDbContext dbContext)
        {
            _context = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTickets(
        [FromQuery] int? userId = null)
        {
            IQueryable<Ticket> query = _context.Tickets
                .Include(t => t.User)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.StartCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.DestinationCity)
                .Select(t => t);

            if (userId.HasValue)
            {
                query = query.Where(t => t.UserId == userId.Value);
            }

            var ticketData = await query.Select(t => new
            {
                t.Id,
                t.UserId,
                t.User.FirstName,
                t.User.LastName,
                t.User.Email,
                t.BusScheduleId,
                BusLineId = t.BusSchedule.BusLineId,
                StartCityId = t.BusSchedule.BusLine.StartCityId,
                StartCityName = t.BusSchedule.BusLine.StartCity.Name,
                DestinationCityId = t.BusSchedule.BusLine.DestinationCityId,
                DestinationCityName = t.BusSchedule.BusLine.DestinationCity.Name,
                OperatorId = t.BusSchedule.OperatorId,
                OperatorName = t.BusSchedule.Operator.Name,
                Departure = t.BusSchedule.Departure,
                Arrival = t.BusSchedule.Arrival,
                t.Seat,
                t.DateOfBooking,
                StopIds = t.BusSchedule.BusScheduleStops.Select(bss => bss.StopId).ToList()
            }).ToListAsync();

            return Ok(ticketData);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var ticketData = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.StartCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.DestinationCity)
                .Where(t => t.Id == id)
                .Select(t => new
                {
                    t.Id,
                    t.UserId,
                    t.User.FirstName,
                    t.User.LastName,
                    t.User.Email,
                    t.BusScheduleId,
                    BusLineId = t.BusSchedule.BusLineId,
                    StartCityId = t.BusSchedule.BusLine.StartCityId,
                    StartCityName = t.BusSchedule.BusLine.StartCity.Name,
                    DestinationCityId = t.BusSchedule.BusLine.DestinationCityId,
                    DestinationCityName = t.BusSchedule.BusLine.DestinationCity.Name,
                    OperatorId = t.BusSchedule.OperatorId,
                    OperatorName = t.BusSchedule.Operator.Name,
                    Departure = t.BusSchedule.Departure,
                    Arrival = t.BusSchedule.Arrival,
                    t.Seat,
                    t.DateOfBooking,
                    StopIds = t.BusSchedule.BusScheduleStops.Select(bss => bss.StopId).ToList()
                })
                .SingleOrDefaultAsync(); // Changed to SingleOrDefaultAsync as we're fetching one ticket by ID

            if (ticketData == null)
            {
                return NotFound();
            }

            return Ok(ticketData);
        }



        [HttpPost]
        public async Task<IActionResult> AddTicket([FromBody] TicketDTO ticketDTO)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == ticketDTO.UserId);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var busSchedule = await _context.BusSchedules.FindAsync(ticketDTO.BusScheduleId);
            if (busSchedule == null)
            {
                return BadRequest("Bus schedule not found.");
            }

            // Check if there are any available seats for the given bus schedule
            var bookedSeats = await _context.Tickets
                .Where(t => t.BusScheduleId == ticketDTO.BusScheduleId)
                .Select(t => t.Seat)
                .ToListAsync();

            var availableSeats = Enumerable.Range(1, 10).Except(bookedSeats).ToList();
            if (availableSeats.Count == 0)
            {
                return BadRequest("No seats left for this bus schedule.");
            }

            // Assign a random available seat
            var random = new Random();
            var randomSeatIndex = random.Next(availableSeats.Count);
            var selectedSeat = availableSeats[randomSeatIndex];

            var ticket = new Ticket
            {
                UserId = ticketDTO.UserId,
                BusScheduleId = ticketDTO.BusScheduleId,
                Seat = selectedSeat,
                DateOfBooking = ticketDTO.DateOfBooking
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            // Construct the response object
            var response = new
            {
                id = ticket.Id,
                userId = ticket.UserId,
                busScheduleId = ticket.BusScheduleId,
                busLineId = busSchedule.BusLineId,
                operatorId = busSchedule.OperatorId,
                seat = ticket.Seat,
                dateOfBooking = ticket.DateOfBooking
            };

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, response);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] TicketDTO ticketDTO)
        {
            var existingTicket = await _context.Tickets.FindAsync(id);
            if (existingTicket == null)
            {
                return NotFound();
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == ticketDTO.UserId);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var busSchedule = await _context.BusSchedules.FindAsync(ticketDTO.BusScheduleId);
            if (busSchedule == null)
            {
                return BadRequest("Bus schedule not found.");
            }

            // Check if the seat number is valid
            if (ticketDTO.Seat != 0 && (ticketDTO.Seat < 1 || ticketDTO.Seat > 10))
            {
                return BadRequest("Seat number must be between 1 and 10.");
            }

            // Check if the seat number is already taken for the given bus schedule
            if (ticketDTO.Seat != 0)
            {
                var isSeatTaken = await _context.Tickets
                    .AnyAsync(t => t.Id != id && t.BusScheduleId == ticketDTO.BusScheduleId && t.Seat == ticketDTO.Seat);

                if (isSeatTaken)
                {
                    return BadRequest("Seat is already taken.");
                }
            }

            // Check if all seats are taken for the new bus schedule
            if (ticketDTO.BusScheduleId != existingTicket.BusScheduleId)
            {
                var bookedSeats = await _context.Tickets
                    .Where(t => t.BusScheduleId == ticketDTO.BusScheduleId)
                    .Select(t => t.Seat)
                    .ToListAsync();

                var availableSeats = Enumerable.Range(1, 10).Except(bookedSeats).ToList();
                if (availableSeats.Count == 0)
                {
                    return BadRequest("All seats are taken for this bus schedule. Cannot change bus schedule.");
                }
            }

            existingTicket.UserId = ticketDTO.UserId;
            existingTicket.User = user;

            // Update the bus schedule only if all seats are not taken for the new bus schedule
            if (ticketDTO.BusScheduleId != existingTicket.BusScheduleId)
            {
                existingTicket.BusScheduleId = ticketDTO.BusScheduleId;
                existingTicket.BusSchedule = busSchedule;
            }

            // Update the seat only if it's provided and not equal to 0
            if (ticketDTO.Seat != 0)
            {
                existingTicket.Seat = ticketDTO.Seat;
            }

            existingTicket.DateOfBooking = ticketDTO.DateOfBooking;

            _context.Entry(existingTicket).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Reload the updated ticket with all related entities
            existingTicket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.StartCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.DestinationCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.Operator) // Include the Operator property
                .FirstOrDefaultAsync(t => t.Id == existingTicket.Id);

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TicketExists(int id)
        {
            return _context.Tickets.Any(e => e.Id == id);
        }
    }
}
