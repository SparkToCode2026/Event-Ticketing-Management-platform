using System.ComponentModel.DataAnnotations;
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
    }
}
