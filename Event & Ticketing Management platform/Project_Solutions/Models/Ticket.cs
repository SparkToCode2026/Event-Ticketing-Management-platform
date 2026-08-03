using System.ComponentModel.DataAnnotations;

namespace Project_Solutions.Models
{
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }
        public Boolean IsUsed { get; set; }
        public string IssuedAt { get; set; }
    }
}
