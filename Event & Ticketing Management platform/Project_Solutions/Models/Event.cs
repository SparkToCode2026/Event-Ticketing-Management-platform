
namespace Project_Solutions.Models
{
    public class Event
    {
        [Key]
        public int EventId { get; set; }
        public string EventName { get; set; }
        public DateTime EventDate { get; set; }
        public TimeOnly EventStartTime { get; set; }
        public TimeOnly EventEndTime { get; set; }
        public string EventDescription { get; set; }
    }
}
