using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Project_Solutions.Models


{
    public class Speaker
    {
        
        [Key]
        [JsonIgnore]
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
}
