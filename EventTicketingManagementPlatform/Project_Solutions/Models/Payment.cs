using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class Payment
    {
        
        [Key]
        [JsonIgnore]
        public int PaymentId { get; set; }
        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.Now;
        [Required, MaxLength(50)]
        public string PaymentMethod { get; set; }        
        [Required, MaxLength(50)]
        public string PaymentStatus { get; set; }
        [Required]
        public decimal  PaymentAmount { get; set; }

        // 1:1 this payment belongs to one order
        [Required]
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        [JsonIgnore]
        public Order Order { get; set; }
    }

    //when a user wants to make a payment, they will send a request with the payment method and the order ID.
    //This class represents that request.
    public class PaymentRequest
    {
        [Required]
        public string PaymentMethod { get; set; }

        [Required]
        public int OrderId { get; set; }
    }
}
