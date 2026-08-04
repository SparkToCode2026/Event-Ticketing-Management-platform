using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Project_Solutions.Models
{
    public class Review
    {
        [Key]
        [JsonIgnore]
        public int ReviewID { get; set; }
        [Required, Range(1, 5)]
        public int Rating { get; set; }
        [MaxLength(500)]
        public string Comment { get; set; }
        [Required]
        public DateTime ReviewDate { get; set; }

        // M:1 many reviews per user
        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        [JsonIgnore]
        public User User { get; set; }

        // M:1 many reviews per event
        [Required]
        public int EventId { get; set; }
        [ForeignKey("EventId")]
        [JsonIgnore]
        public Event Event { get; set; }
    }
}
