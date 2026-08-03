using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Solutions.Models
{
    public class EventCategory
    {
        [Key]
        public int EventCategoryId { get; set; }
        public string EventCategoryName { get; set;
        public string EventCategoryDescription { get; set; }

        [ForeignKey]
        public List <Event> Events { get; set; }
    }
}
