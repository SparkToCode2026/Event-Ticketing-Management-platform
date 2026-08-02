using System.ComponentModel.DataAnnotations;

namespace Project_Solutions.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, EmailAddress, MaxLength(150)]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required, MaxLength(20)]
        public string Role { get; set; } // "Attendee", "Organizer", or "Admin"

        // Navigation properties (relationships to other models)
        public OrganizerProfile OrganizerProfile { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }
}