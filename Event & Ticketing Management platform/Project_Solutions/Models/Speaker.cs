using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Project_Solutions.Models


{
    public class Speaker
    {
        
        [Key]
        public int SpeakerId { get; set; }
        
        [Required]
        public string SpeakerName { get; set; }
        
        public string SpeakerBio { get; set; }
        
        public string SpeakerTopic { get; set; }

        //ForeignKey  From Event Table 1-M 
        [ForeignKey("Event")]
        public int EventId { get; set; }
        
        [JsonIgnore]
        public Event Event { get; set; }
    }
}
