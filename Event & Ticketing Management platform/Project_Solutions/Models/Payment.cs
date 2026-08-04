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
        
        [Required]
        public string PaymentMethod { get; set; }
        
        [Required]
        public string PaymentStatus { get; set; }
        
        [Required]
        public decimal  PaymentAmount { get; set; }
        
        // Foreign Key From Order Table (1-M)
        [ForeignKey("Order")]
        public int OrderId { get; set; }
        
        [JsonIgnore]
        public Order Order { get; set; }
        
        
    }
}
