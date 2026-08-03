using System.ComponentModel.DataAnnotations;

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
        public string PasswordHash { get; set; }

        [Required, MaxLength(20)]
        public string Role { get; set; }

        public OrganizerProfile? OrganizerProfile { get; set; }
    }
}