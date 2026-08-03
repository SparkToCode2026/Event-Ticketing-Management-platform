using System.ComponentModel.DataAnnotations;

namespace Project_Solutions.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        public double TotalAmount { get; set; }
        public string Orderstatus { get; set; }
        public string OrderDate { get; set; }
    }
}
