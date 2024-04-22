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
        public async Task<IActionResult> GetAllTickets()
        {
            var ticketData = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.StartCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.DestinationCity)
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
                    DestinationCityId = t.BusSchedule.BusLine.DestinationCityId,
                    OperatorId = t.BusSchedule.OperatorId,
                    OperatorName = t.BusSchedule.Operator.Name,
                    Departure = t.BusSchedule.Departure,
                    Arrival = t.BusSchedule.Arrival,
                    t.Seat,
                    t.DateOfBooking,
                    StopIds = t.BusSchedule.BusScheduleStops.Select(bss => bss.StopId).ToList()
                })
                .ToListAsync();

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
                .Where(t => t.Id == id) // Changed to filter by ticket ID instead of user ID
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
                    DestinationCityId = t.BusSchedule.BusLine.DestinationCityId,
                    OperatorId = t.BusSchedule.OperatorId,
                    OperatorName = t.BusSchedule.Operator.Name,
                    Departure = t.BusSchedule.Departure,
                    Arrival = t.BusSchedule.Arrival,
                    t.Seat,
                    t.DateOfBooking,
                    StopIds = t.BusSchedule.BusScheduleStops.Select(bss => bss.StopId).ToList()
                })
                .ToListAsync();

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

            var ticket = new Ticket
            {
                UserId = ticketDTO.UserId,
                BusScheduleId = ticketDTO.BusScheduleId,
                Seat = ticketDTO.Seat,
                DateOfBooking = ticketDTO.DateOfBooking
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTicket), new { userId = ticket.UserId }, ticket);
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

            existingTicket.UserId = ticketDTO.UserId;
            existingTicket.User = user;
            existingTicket.BusScheduleId = ticketDTO.BusScheduleId;
            existingTicket.BusSchedule = busSchedule;
            existingTicket.Seat = ticketDTO.Seat;
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
