using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class EventCategory
    {
        [Key]
        [JsonIgnore]
        public int EventCategoryId { get; set; }
        [Required, MaxLength(100)]
        public string EventCategoryName {get; set;}
        [MaxLength(500)]
        public string EventCategoryDescription { get; set; }

        // 1:M one caregory classifies many events
        [JsonIgnore]
        public List<Event>? Events { get; set; }
    }
}