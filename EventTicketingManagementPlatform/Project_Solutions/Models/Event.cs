using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class Event
    {
        [Key]
        public int EventId { get; set; }
        [Required, MaxLength(150)]
        public string EventName { get; set; }
        [Required]
        public DateTime EventDate { get; set; }
        [Required]
        public TimeOnly EventStartTime { get; set; }
        [Required]
        public TimeOnly EventEndTime { get; set; }
        [MaxLength(1000)]
        public string EventDescription { get; set; }

        // M:1 many events per category
        [Required]
        public int EventCategoryId { get; set; }
        [ForeignKey("EventCategoryId")]
        
        public EventCategory? EventCategory { get; set; }

        // M:1 many events per organizer
        [Required]
        public int OrganizerId { get; set; }
        [ForeignKey("OrganizerId")]
        
        public OrganizerProfile? OrganizerProfile { get; set; }

        // 1:M one event has many speakers
        [JsonIgnore]
        public List<Speaker>? Speakers { get; set; }

        // M:1 many events per venue
        [Required]
        public int VenueId { get; set; }
        [ForeignKey("VenueId")]
        
        public Venue? Venue { get; set; }

        // 1:M one event has many tickets tiers
        [JsonIgnore]
        public List<TicketType>? TicketType { get; set; }

        // 1:M one event has many reviews
        [JsonIgnore]
        public List<Review>? Reviews { get; set; }
    }
}