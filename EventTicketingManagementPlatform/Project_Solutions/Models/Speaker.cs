using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Project_Solutions.Models


{
    public class Speaker
    {
        
        [Key]
        public int SpeakerId { get; set; }
        [Required, MaxLength(50)]
        public string SpeakerName { get; set; }
        [MaxLength(1000)]
        public string SpeakerBio { get; set; }
        [MaxLength(300)]
        public string SpeakerTopic { get; set; }

        // M:1 many speakers can speak at one event
        [Required]
        public int EventId { get; set; }
        [ForeignKey("EventId")]
        [JsonIgnore]
        public Event Event { get; set; }
    }

    public class SpeakerCreateRequest
    {
        [Required, MaxLength(150)]
        public string SpeakerName { get; set; }

        public string? SpeakerBio { get; set; }

        public string? SpeakerTopic { get; set; }

        [Required]
        public int EventId { get; set; }
    }
}
