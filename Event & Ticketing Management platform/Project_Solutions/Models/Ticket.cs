using Microsoft.AspNetCore.Routing.Constraints;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class Ticket
    {
        [Key]
        [JsonIgnore]
        public int TicketId { get; set; }
        public Boolean IsUsed { get; set; }
        public DateTime IssuedAt { get; set; }

        //1:M relationship with Ticket
        [Required]
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        [JsonIgnore]
        public Order Order { get; set; }

        //1:M relationship with TicketType and Tickets
        [JsonIgnore]
        public List<TicketType>? TicketTypes { get; set; }
    }
}
