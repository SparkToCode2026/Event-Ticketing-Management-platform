using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Project_Solutions.Models
{
    public class Order
    {
        [Key]
        [JsonIgnore]
        public int OrderId { get; set; }
        public double TotalAmount { get; set; }
        public string Orderstatus { get; set; }
        public DateTime OrderDate { get; set; }

        //1:1 relationship with Order
        [JsonIgnore]
        public Promotion? Promotion { get; set; }

        //1:M relationship with Ticket
        [JsonIgnore]
        public List<Ticket>? Tickets { get; set; }

        //1:1 relationship with Order
        [JsonIgnore]
        public Payment Payment { get; set; }

        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        [JsonIgnore]
        public User User { get; set; }


    }
}
