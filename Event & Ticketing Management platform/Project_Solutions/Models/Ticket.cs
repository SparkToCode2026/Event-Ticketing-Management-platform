using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Solutions.Models
{
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }
        public Boolean IsUsed { get; set; }
        public string IssuedAt { get; set; }

        //1:M relationship with Ticket
        [Required]
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }
}
