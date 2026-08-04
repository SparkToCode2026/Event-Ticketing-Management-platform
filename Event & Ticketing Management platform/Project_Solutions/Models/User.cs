using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public string UserName { get; set; }

        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; }

        [Required]
        [JsonIgnore]
        public string PasswordHash { get; set; }

        [Required, MaxLength(20)]
        public string Role { get; set; }
        
        [JsonIgnore]
        public OrganizerProfile? OrganizerProfile { get; set; }

        [JsonIgnore]
        public List<Review>? Reviews { get; set; } 
        
        [JsonIgnore]
        public List<Order>? Orders { get; set; }
    }

    public class RegisterRequest
    {
        [Required, MaxLength(100)]
        public string UserName { get; set; }

        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; }

        [Required, MinLength(6)]
        public string Password { get; set; }

        [Required, MaxLength(20)]
        public string Role { get; set; }
    }

    public class LoginRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}