using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Models;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // Updates a user's Name/Email
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, User updatedUser)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.UserName = updatedUser.UserName;
            user.Email = updatedUser.Email;

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        // Admin-only: changes a user's role
        [HttpPatch("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRole(int id, string newRole)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            { 
               return NotFound(); 
            }

            user.Role = newRole;
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        // Admin-only: deletes a user
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Gets all users, including their OrganizerProfile if they have one
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users.Include(u => u.OrganizerProfile).ToListAsync();
            return Ok(users);
        }

        // Gets a single user by Id
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.Users.Include(u => u.OrganizerProfile).FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null) return NotFound();
            return Ok(user);
        }

        // Filters users by role (e.g. "Organizer")
        [HttpGet("by-role/{role}")]
        [Authorize]
        public async Task<IActionResult> GetByRole(string role)
        {
            var users = await _context.Users.Where(u => u.Role == role).ToListAsync();
            return Ok(users);
        }

        // Admin-only: counts how many users exist per role
        [HttpGet("role-counts")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetRoleCounts()
        {
            var counts = await _context.Users.GroupBy(u => u.Role).Select(g => new { Role = g.Key, Count = g.Count() }).ToListAsync();

            return Ok(counts);
        }
    }
}