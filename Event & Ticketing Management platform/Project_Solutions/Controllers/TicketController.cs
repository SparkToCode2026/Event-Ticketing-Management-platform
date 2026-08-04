using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Models;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("Ticket")]
    public class TicketController : ControllerBase
    {
        private AppDbContext context;
        public TicketController(AppDbContext _context)
        {
            context = _context;
        }

        // POST: Ticket/Addticket
        [HttpPost("AddTicket")]
        [Authorize]
        public IActionResult AddTicket(Ticket ticket)
        {
            var orderExists = context.Orders.Any(o => o.OrderId == ticket.OrderId);
            if (!orderExists)
            {
                return NotFound($"Order with ID {ticket.OrderId} not found.");
            }

            //var ticketTypeExits = context.TicketTypes.Any(tt => tt.TicketTypeId == ticket.TicketTypes);
            //if (!ticketTypeExits)
            //{
            //    return NotFound($"Ticket type with ID {ticket.TicketTypes} not found.");
            //}

            ticket.IssuedAt = DateTime.Now;
            ticket.IsUsed = false;


            context.Tickets.Add(ticket);
            context.SaveChanges();

            return Ok($"Ticket addded successfully with ID: {ticket.TicketId}");
        }

        [HttpPut("UpdateTicket")]
        [Authorize]
        public IActionResult UpdateTicket(int id, Ticket t)
        {
            Ticket ticket = context.Tickets.FirstOrDefault(t => t.TicketId == id);
            if (ticket == null)
            {
                return NotFound("Ticket not found");
            }
            else
            {
                ticket.IsUsed = t.IsUsed;
                ticket.IssuedAt = DateTime.Now;
                // ticket.TicketTypeId = t.TicketTypeId;
                ticket.OrderId = t.OrderId;
                
                context.SaveChanges();

                return Ok($"Ticket with ID: {id} updated successfully.");
            }
        }

        // PATCH: Make ticket as used
        [HttpPatch("MarkTicketAsUsed")]
        [Authorize]
        public IActionResult MakeTicketAsUsed(int id)
        {
            Ticket ticket = context.Tickets.FirstOrDefault(t => t.TicketId == id);
            if (ticket == null)
            {
                return NotFound("Ticket not found");
            }
            else if (ticket.IsUsed)
            {
                return BadRequest("Ticket is already marked as used.");
            }
            else
            {
                ticket.IsUsed = true;

                context.SaveChanges();

                return Ok($"Ticket with ID: {id} marked as used successfully.");
            }
        }

        // DELETE
        [HttpDelete("DeleteTicket")]
        [Authorize]
        public IActionResult DeleteTicket(int id)
        {
            Ticket ticket = context.Tickets.FirstOrDefault(t => t.TicketId == id);
            if (ticket == null)
            {
                return NotFound("Ticket not found");
            }
            else
            {
                context.Tickets.Remove(ticket);
                context.SaveChanges();

                return Ok($"Ticket with ID: {id} deleted successfully.");
            }
        }

        // GET: Get all tickets including Order and TicketType
        [HttpGet("GetAllTickets")]
        [Authorize]
        public IActionResult GetAllTickets()
        {
            var tickets = context.Tickets
                .Include(t => t.Order)
                //.Include(t => t.TicketType)
                .ToList();
            return Ok(tickets);
        }

        // GET by ID
        [HttpGet("GetTicketById")]
        [Authorize]
        public IActionResult GetTicketById(int id)
        {
            Ticket ticket = context.Tickets
                .Include(t => t.Order)
                //.Include(t => t.TicketType)
                .FirstOrDefault(t => t.TicketId == id);
            if (ticket == null)
            {
                return NotFound("Ticket not found");
            }
            else
            {
                return Ok(ticket);
            }
        }

        // GET all ticket for a given Order ID
        [HttpGet("GetTicketsByOrderId")]
        [Authorize]
        public IActionResult GetTicketByOrderId(int orderId)
        {
            List<Ticket> tickets = context.Tickets
                .Where(t => t.OrderId == orderId)
                //.Include(t => t.TicketType)
                .ToList();
            return Ok(tickets);
        }

        // GET usage statistics
        [HttpGet("GetTicketUsageStatistics")]
        [Authorize]
        public IActionResult GetTicketUsageStatistics()
        {
            int totalTickets = context.Tickets.Count();
            int usedTickets = context.Tickets.Count(t => t.IsUsed);
            int unusedTickets = totalTickets - usedTickets;

            List<Ticket> recentTickets = context.Tickets
                .OrderByDescending(t => t.IssuedAt)
                .Take(10)
                .ToList();
            
            return Ok(new { totalTickets, usedTickets, unusedTickets, recentTickets });
        }
    }
}
