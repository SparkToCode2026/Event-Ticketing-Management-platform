using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Solutions.Models
{
    public class TicketType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TicketTypeId { get; set; }
        
        [MaxLength(45)]
        public string Category { get; set; }
        
        public decimal  Price { get; set; }
        
        public string Benefits { get; set; }
    }
}
