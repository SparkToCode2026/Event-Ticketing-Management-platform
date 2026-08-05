using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class Order
    {
        [Key]
        [JsonIgnore]
        public int OrderId { get; set; }
        [Required]
        public decimal TotalAmount { get; set; }
        [Required, MaxLength(50)]
        public string OrderStatus { get; set; }
        [Required]
        public DateTime OrderDate { get; set; }

        // M:1 many orders per user
        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        [JsonIgnore]
        [ValidateNever]
        public User User { get; set; }

        // M:1 many orders can use the same  promo
        public int? PromotionId { get; set; }
        [ForeignKey("PromotionId")]
        [JsonIgnore]
        [ValidateNever]
        public Promotion Promotion { get; set; }

        // 1:M one order contain many tickets
        [JsonIgnore]
        [ValidateNever]
        public List<Ticket>? Tickets { get; set; }

        // 1:1 one order has one payment
        [JsonIgnore]
        [ValidateNever]
        public Payment? Payment { get; set; }
    }
}
