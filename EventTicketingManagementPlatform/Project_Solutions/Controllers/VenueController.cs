using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
// TODO: عدّل الـ using هذا ليطابق مكان الـ DbContext عندك
using Project_Solutions.Data;
using Project_Solutions.Models;
using Project_Solutions.Helpers;
using Microsoft.AspNetCore.Authorization;


namespace Project_Solutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VenueController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VenueController(AppDbContext context)
        {
            _context = context;
        }
 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venue>>> GetVenues()
        {
            return await _context.Venues.ToListAsync();
        }
 
        // GET: api/Venue/5
        [HttpGet("{id}")]
        [Authorize(Roles = Roles.Organizer + "," + Roles.Admin)]
        public async Task<ActionResult<Venue>> GetVenue(int id)
        {
            var venue = await _context.Venues.FindAsync(id);
 
            if (venue == null)
            {
                return NotFound();
            }
 
            return venue;
        }
 
        // POST: api/Venue
        [HttpPost]
        [Authorize(Roles = Roles.Organizer + "," + Roles.Admin)]
        public async Task<ActionResult<Venue>> PostVenue(Venue venue)
        {
            _context.Venues.Add(venue);
            await _context.SaveChangesAsync();
 
            return CreatedAtAction(nameof(GetVenue), new { id = venue.VenueId }, venue);
        }
 
        // PUT: api/Venue/5
        [HttpPut("{id}")]
        [Authorize(Roles = Roles.Organizer + "," + Roles.Admin)]
        public async Task<IActionResult> PutVenue(int id, Venue venue)
        {
            if (id != venue.VenueId)
            {
                return BadRequest();
            }
 
            _context.Entry(venue).State = EntityState.Modified;
 
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VenueExists(id))
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
 
        // DELETE: api/Venue/5
        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Organizer + "," + Roles.Admin)]
        public async Task<IActionResult> DeleteVenue(int id)
        {
            var venue = await _context.Venues.FindAsync(id);
            if (venue == null)
            {
                return NotFound();
            }
 
            _context.Venues.Remove(venue);
            await _context.SaveChangesAsync();
 
            return NoContent();
        }
 
        private bool VenueExists(int id)
        {
            return _context.Venues.Any(e => e.VenueId == id);
        }
    }
}