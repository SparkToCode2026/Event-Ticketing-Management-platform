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
        
        [JsonIgnore]
        public OrganizerProfile? OrganizerProfile { get; set; }

        [JsonIgnore]
        public List<Review>? Reviews { get; set; } 
        
        [JsonIgnore]
        public List<Order>? Orders { get; set; }
    }
}