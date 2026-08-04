using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Project_Solutions.Models
{
    public class Promotion
    {
        [Key]
        public int PromotionID { get; set; }
        
        public string PromotionCode { get; set; }
        
        public string PromotionType { get; set; }
        
        public DateTime PromotionStartDate { get; set; }
        
        public DateTime PromotionExpiry { get; set; }

        [Required]
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }
}
