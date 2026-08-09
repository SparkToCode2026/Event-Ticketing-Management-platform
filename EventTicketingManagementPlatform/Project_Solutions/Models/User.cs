using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }   // removed [JsonIgnore]

        [Required, MaxLength(100)]
        public string UserName { get; set; }

        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; }

        [Required]
        [JsonIgnore]                      // added here instead
        public string PasswordHash { get; set; }

        public string Role { get; set; }

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

    }

    public class LoginRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class UpdateRoleRequest
    {
        [Required]
        public string Role { get; set; }
    }
}