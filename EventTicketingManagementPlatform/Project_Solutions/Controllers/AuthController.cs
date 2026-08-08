using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Helpers;
using Project_Solutions.Models;
using Project_Solutions.Services.Auth;
using Project_Solutions.Helpers;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly PasswordHasher _passwordHasher;

        public AuthController(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
            _passwordHasher = new PasswordHasher();
        }

        // Creates a new user account and returns a JWT token
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
            {
                return BadRequest("A user with this email already exists.");
            }
            
            var newUser = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                Role = Roles.Attendee
            };

            newUser.PasswordHash = _passwordHasher.HashPassword(newUser, request.Password);

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var token = _tokenService.GenerateToken(newUser);
            return Ok(new { token, user = newUser });
        }

        // Checks email/password and returns a JWT token if valid
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            bool validPassword = _passwordHasher.VerifyPassword(user, user.PasswordHash, request.Password);

            if (!validPassword)
                return Unauthorized("Invalid email or password.");

            var token = _tokenService.GenerateToken(user);
            return Ok(new { token, user });
        }
    }
}