using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class OrganizerProfile
    {
        [Key]
        public int OrganizerId { get; set; }   // removed [JsonIgnore]

        [Required, MaxLength(150)]
        public string CompanyName { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public List<Event>? Events { get; set; }
    }
}