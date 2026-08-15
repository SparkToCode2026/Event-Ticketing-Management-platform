using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Project_Solutions.Models
{
    public class Promotion
    {
        [Key]
        public int PromotionId { get; set; }
        [Required, MaxLength(50)]
        public string PromotionCode { get; set; }
        [Required, MaxLength(50)]
        public string PromotionType { get; set; }

        [Required]
        public decimal DiscountAmount { get; set; }

        [Required]
        public DateTime PromotionStartDate { get; set; }
        [Required]
        public DateTime PromotionExpiry { get; set; }

        // 1:M one promotion can be used to many orders
        [JsonIgnore]
        public List<Order>? Orders { get; set; }
    }
}
