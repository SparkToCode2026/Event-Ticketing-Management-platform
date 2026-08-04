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

        [MaxLength(45)]
        public string Category { get; set; }

        public decimal Price { get; set; }

        public string Benefits { get; set; }

        //1:M relationship with TicketType and Tickets
        [Required]
        public int TicketId { get; set; } // Foreign key to Ticket
        [ForeignKey("TicketId")]
        [JsonIgnore]
        public Ticket Ticket { get; set; }
    }
}