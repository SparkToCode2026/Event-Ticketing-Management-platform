using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class OrganizerProfile
    {
        [Key]
        [JsonIgnore]
        public int OrganizerId { get; set; }

        [Required]
        public int UserId { get; set; }               // FK to User

        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required, MaxLength(150)]
        public string CompanyName { get; set; }


        //1:M relationship with OrganizerProfile and Events
        [JsonIgnore]
        public List<Event>? Events { get; set; }
    }
}