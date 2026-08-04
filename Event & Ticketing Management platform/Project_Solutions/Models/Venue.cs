using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace Project_Solutions.Models
{
    public class Venue
    {
        [Key]
        [JsonIgnore]
        public int Venue_Id { get; set; }
        
        [MaxLength(35)]
        public string Address { get; set; }
        
        [MaxLength(30)]
        public string Name { get; set; }

        //1:M relationship with Events and Venue
        [JsonIgnore]
        public List<Event>? Events { get; set; }
    }
}
