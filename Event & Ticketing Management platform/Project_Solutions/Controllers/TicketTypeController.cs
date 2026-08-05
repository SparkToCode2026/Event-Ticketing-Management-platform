using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Models;
using Project_Solutions.Data;
 
namespace Project_Solutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketTypeController : ControllerBase
    {
        private readonly AppDbContext _context;
 
        public TicketTypeController(AppDbContext context)
        {
            _context = context;
        }
 
        // GET: api/TicketType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetTicketTypes()
        {
            return await _context.TicketTypes.ToListAsync();
        }
 
        // GET: api/TicketType/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketType>> GetTicketType(int id)
        {
            var ticketType = await _context.TicketTypes.FindAsync(id);
 
            if (ticketType == null)
            {
                return NotFound();
            }
 
            return ticketType;
        }
 
        // GET: api/TicketType/ByTicket/5
        [HttpGet("ByTicket/{ticketId}")]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetTicketTypesByTicket(int ticketId)
        {
            var ticketTypes = await _context.TicketTypes
                .Where(t => t.TicketId == ticketId)
                .ToListAsync();
 
            return ticketTypes;
        }
 
        // POST: api/TicketType
        [HttpPost]
        public async Task<ActionResult<TicketType>> PostTicketType(TicketType ticketType)
        {
            _context.TicketTypes.Add(ticketType);
            await _context.SaveChangesAsync();
 
            return CreatedAtAction(nameof(GetTicketType), new { id = ticketType.TicketTypeId }, ticketType);
        }
 
        // PUT: api/TicketType/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTicketType(int id, TicketType ticketType)
        {
            if (id != ticketType.TicketTypeId)
            {
                return BadRequest();
            }
 
            _context.Entry(ticketType).State = EntityState.Modified;
 
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketTypeExists(id))
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
 
        // DELETE: api/TicketType/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicketType(int id)
        {
            var ticketType = await _context.TicketTypes.FindAsync(id);
            if (ticketType == null)
            {
                return NotFound();
            }
 
            _context.TicketTypes.Remove(ticketType);
            await _context.SaveChangesAsync();
 
            return NoContent();
        }
 
        private bool TicketTypeExists(int id)
        {
            return _context.TicketTypes.Any(e => e.TicketTypeId == id);
        }
    }
}