using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
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

        //1:M many tickets share one type
        [Required]
        public int TicketTypeId { get; set; }
        [ForeignKey("TicketTypeId")]
        [JsonIgnore]
        [ValidateNever]
        public TicketType TicketType { get; set; }

        // M:1 many tickets belong to one order
        [Required]
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        [JsonIgnore]
        [ValidateNever]
        public Order Order { get; set; }
    }
}
