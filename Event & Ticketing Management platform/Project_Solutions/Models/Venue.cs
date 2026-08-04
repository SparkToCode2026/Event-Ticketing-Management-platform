using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace Project_Solutions.Models
{
    public class Venue
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Venue_Id { get; set; }
        
        [MaxLength(35)]
        public string Address { get; set; }
        
        [MaxLength(30)]
        public string Name { get; set; }
    }
}
