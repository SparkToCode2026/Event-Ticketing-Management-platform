using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class Event
    {
        [Key]
        [JsonIgnore]
        public int EventId { get; set; }
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public TimeOnly EventStartTime { get; set; }
        public TimeOnly EventEndTime { get; set; }
        public string EventDescription { get; set; }

        //1:M relationship with EventCategory and Events
        [JsonIgnore]
        public List<EventCategory>? EventCategories { get; set; }

        //1:M relationship with OrganizerProfile and Events
        [Required]
        public int OrganizerId { get; set; } // Foreign key to OrganizerProfile
        [ForeignKey("OrganizerId")]
        [JsonIgnore]
        public OrganizerProfile OrganizerProfile { get; set; }

        //1:M relationship with Events and Speaker
        [JsonIgnore]
        public List<Speaker>? Speakers { get; set; }

        //1:M relationship with Events and Venue
        [Required]
        public int VenueId { get; set; } // Foreign key to Venue
        [ForeignKey("VenueId")]
        [JsonIgnore]
        public Venue Venue { get; set; }

    }
}