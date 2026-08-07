using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Helpers;
using Project_Solutions.Models;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganizerProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrganizerProfileController(AppDbContext context)
        {
            _context = context;
        }

        // Creates a new organizer profile
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Create(OrganizerProfile newProfile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.OrganizerProfiles.Add(newProfile);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = newProfile.OrganizerId }, newProfile);
        }

        // Updates CompanyName
        [HttpPut("{id}")]
        [Authorize(Roles = Roles.Organizer + "," + Roles.Admin)]
        public async Task<IActionResult> Update(int id, OrganizerProfile updatedProfile)
        {
            var profile = await _context.OrganizerProfiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            profile.CompanyName = updatedProfile.CompanyName;

            await _context.SaveChangesAsync();
            return Ok(profile);
        }

        // Reassigns this profile to a different User
        [HttpPatch("{id}/user")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> ReassignUser(int id, int newUserId)
        {
            var profile = await _context.OrganizerProfiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            profile.UserId = newUserId;

            await _context.SaveChangesAsync();
            return Ok(profile);
        }

        // Deletes an organizer profile
        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(int id)
        {
            var profile = await _context.OrganizerProfiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            _context.OrganizerProfiles.Remove(profile);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Gets all organizer profiles, including linked User and their Events
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var profiles = await _context.OrganizerProfiles
                .Include(o => o.User)
                .Include(o => o.Events)
                .ToListAsync();

            return Ok(profiles);
        }

        // Gets a single organizer profile by Id
        [HttpGet("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetById(int id)
        {
            var profile = await _context.OrganizerProfiles
                .Include(o => o.User)
                .Include(o => o.Events)
                .FirstOrDefaultAsync(o => o.OrganizerId == id);

            if (profile == null)
            {
                return NotFound();
            }

            return Ok(profile);
        }

        // Filters organizer profiles by company name
        [HttpGet("by-company/{name}")]
        [Authorize]
        public async Task<IActionResult> GetByCompany(string name)
        {
            var profiles = await _context.OrganizerProfiles
                .Where(o => o.CompanyName.Contains(name))
                .ToListAsync();

            return Ok(profiles);
        }

        // Sorts organizer profiles by how many events they've published
        [HttpGet("by-event-count")]
        [Authorize]
        public async Task<IActionResult> GetSortedByEventCount()
        {
            var result = await _context.OrganizerProfiles
                .Select(o => new { o.OrganizerId, o.CompanyName, EventCount = o.Events.Count })
                .OrderByDescending(o => o.EventCount)
                .ToListAsync();

            return Ok(result);
        }
    }
}