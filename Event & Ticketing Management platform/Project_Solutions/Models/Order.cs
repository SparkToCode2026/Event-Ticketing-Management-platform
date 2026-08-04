using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Solutions.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        public double TotalAmount { get; set; }
        public string Orderstatus { get; set; }
        public string OrderDate { get; set; }

        //1:1 relationship with Order
        public Promotion? Promotion { get; set; }

        //1:M relationship with Ticket
        public List<Ticket> Tickets { get; set; }

        //1:1 relationship with Order
        public Payment? Payment { get; set; }

        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }


    }
}
