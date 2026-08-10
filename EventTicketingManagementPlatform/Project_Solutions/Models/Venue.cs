using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Project_Solutions.Models
{
    public class Venue
    {
        [Key]
        public int VenueId { get; set; }
        
        [Required, MaxLength(150)]
        public string VenueName { get; set; }
        
        [Required, MaxLength(300)]
        public string VenueLocation { get; set; }

        //1:M one venue can host many events
        public List<Event>? Events { get; set; }
    }
}
