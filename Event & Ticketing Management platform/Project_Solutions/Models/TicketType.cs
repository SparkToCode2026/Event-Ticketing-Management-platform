using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class TicketType
    {
        [Key]
        [JsonIgnore]
        public int TicketTypeId { get; set; }

        [Required, MaxLength(45)]
        public string Category { get; set; }
        [Required]
        public decimal Price { get; set; }
        [MaxLength(500)]
        public string Benefits { get; set; }

        // M:1 many ticket types per event
        [Required]
        public int EventId { get; set; }
        [ForeignKey("EventId")]
        [JsonIgnore]
        public Event?  Event { get; set; }

        // 1:M one ticket type has many tickets
        [JsonIgnore]
        public List<Ticket>? Tickets { get; set; }
    }
}