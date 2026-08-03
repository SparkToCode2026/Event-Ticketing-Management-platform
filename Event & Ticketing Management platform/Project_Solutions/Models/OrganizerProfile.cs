using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Solutions.Models
{
    public class OrganizerProfile
    {
        [Key]
        public int OrganizerId { get; set; }

        [Required]
        public int UserId { get; set; }               // FK to User

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required, MaxLength(150)]
        public string CompanyName { get; set; }
    }
}