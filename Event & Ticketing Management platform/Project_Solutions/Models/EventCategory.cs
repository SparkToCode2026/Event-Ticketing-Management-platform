using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class EventCategory
    {
        [Key]
        [JsonIgnore]
        public int EventCategoryId { get; set; }
        public string EventCategoryName {get; set;}
        public string EventCategoryDescription { get; set; }

        [JsonIgnore]
        public List<Event> Events { get; set; }
    }
}