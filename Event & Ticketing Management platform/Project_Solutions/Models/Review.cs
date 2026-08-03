using System.ComponentModel.DataAnnotations;
namespace Project_Solutions.Models
{
    public class Review
    {
        [Key]
        public int ReviewID { get; set; }
        
        public int Rating { get; set; }
        
        public string Comment { get; set; }
        
        public DateTime ReviewDate { get; set; }
    }
}
