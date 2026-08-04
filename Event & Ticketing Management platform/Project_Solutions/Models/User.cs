using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class User
    {
        [Key]
        [JsonIgnore]
        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public string UserName { get; set; }

        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required, MaxLength(20)]
        public string Role { get; set; }
        
        // 1:1 a user may be an orgnizer
        [JsonIgnore]
        public OrganizerProfile? OrganizerProfile { get; set; }

        // 1:M one user writes many reviews
        [JsonIgnore]
        public List<Review>? Reviews { get; set; }

        // 1:M one user places may orders
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