using System.ComponentModel.DataAnnotations;

namespace Project_Solutions.Models
{
    public class EventCategory
    {
        [Key]
        public int EventCategoryId { get; set; }
        public string EventCategoryName { get; set;
        public string EventCategoryDescription { get; set; }
    }
}
