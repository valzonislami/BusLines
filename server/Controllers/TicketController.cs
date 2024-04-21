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
    public class TicketController : ControllerBase
    {
        private readonly BusDbContext _context;

        public TicketController(BusDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.StartCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.DestinationCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.Operator) // Include the Operator property
                .ToListAsync();

            foreach (var ticket in tickets)
            {
                if (ticket.BusSchedule != null && ticket.BusSchedule.Operator != null)
                {
                    var operatorName = await _context.Operators
                        .Where(op => op.Id == ticket.BusSchedule.OperatorId)
                        .Select(op => op.Name)
                        .FirstOrDefaultAsync();

                    ticket.BusSchedule.Operator.Name = operatorName;
                }
            }

            return Ok(tickets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.StartCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.DestinationCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.Operator) // Include the Operator property
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                return NotFound();
            }

            if (ticket.BusSchedule != null && ticket.BusSchedule.Operator != null)
            {
                var operatorName = await _context.Operators
                    .Where(op => op.Id == ticket.BusSchedule.OperatorId)
                    .Select(op => op.Name)
                    .FirstOrDefaultAsync();

                ticket.BusSchedule.Operator.Name = operatorName;
            }

            return Ok(ticket);
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
                User = user,
                BusScheduleId = ticketDTO.BusScheduleId,
                BusSchedule = busSchedule,
                Seat = ticketDTO.Seat,
                DateOfBooking = ticketDTO.DateOfBooking
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            // Reload the ticket with all related entities
            ticket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.StartCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.DestinationCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.Operator) // Include the Operator property
                .FirstOrDefaultAsync(t => t.Id == ticket.Id);

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
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
    }
}
