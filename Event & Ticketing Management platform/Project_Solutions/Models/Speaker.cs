using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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

        
        
        
    }
}
