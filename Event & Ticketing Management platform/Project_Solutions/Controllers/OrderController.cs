using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Models;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("Order")]
    public class OrderController : ControllerBase
    {
        private AppDbContext context;
        public OrderController(AppDbContext _context)
        {
            context = _context;
        }

        // POST: Order/AddOrder
        [HttpPost("AddOrder")]
        public IActionResult AddOrder(Order order)
        {
            order.OrderDate = DateTime.Now;
            if (string.IsNullOrEmpty(order.Orderstatus))
            {
                order.Orderstatus = "Pending";
            }
            
            context.Orders.Add(order);
            context.SaveChanges();

            // email

            return Ok($"Order added successfully with OrderId: {order.OrderId}");
        }

        // PUT: Full update
        [HttpPut("UpdateOrder")]
        public IActionResult UpdateOrder(int id, Order o)
        {
            Order order = context.Orders.FirstOrDefault(o => o.OrderId == id);
            if (order == null)
            {
                return NotFound("Order not found");
            }
            else
            {
                order.TotalAmount = o.TotalAmount;
                order.OrderDate = o.OrderDate;
                order.Orderstatus = o.Orderstatus;
                order.UserId = o.UserId;
                // promotion

                context.SaveChanges();

                return Ok($"Order with id: {id} updated successfully");
            }
        }

        // PATCH: Partial update
        [HttpPatch("UpdateOrderAmount")]
        public IActionResult UpdateOrderAmount(int id, double newAmount)
        {
            Order order = context.Orders.FirstOrDefault(o => o.OrderId == id);
            if (order == null)
            {
                return NotFound("Order not found");
            }
            else if (newAmount < 0)
            {
                return BadRequest("Total amount cannot be naegative");
            }
            else
            {
                order.TotalAmount = newAmount;
                context.SaveChanges();

                return Ok($"Order with id: {id} total amount updated to {newAmount}");
            }
        }

        // DELETE: Order/RemoveOrder
        [HttpDelete("RemoveOrder")]
        public IActionResult RemoveOrder(int id)
        {
            Order order = context.Orders.FirstOrDefault(o => o.OrderId == id);
            if (order == null)
            {
                return NotFound("Order not found");
            }
            else
            {
                context.Orders.Remove(order);
                context.SaveChanges();

                return Ok($"Order with id: {id} removed successfully");
            }
        }

        // GET (list) includes User, Tickets and Payment
        [HttpGet("GetAllOrders")]
        public IActionResult GetAllOrders()
        {
            List<Order> orders = context.Orders
                .Include(o => o.User)
                .Include(o => o.Tickets)
                .Include(o => o.Payment)
                .ToList();

            return Ok(orders);
        }

        // GET by id
        [HttpGet("GetOrderById")]
        public IActionResult GetOrderById(int id)
        {
            Order order = context.Orders
                .Include(o => o.User)
                .Include(o => o.Tickets)
                .Include(o => o.Payment)
                .FirstOrDefault(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound("Order not found");
            }
            else
            {
                return Ok(order);
            }
        }

        // GET by user id
        [HttpGet("GetOrdersByUserId")]
        public IActionResult GetOrdersByUserId(int userId)
        {
            List<Order> orders = context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Tickets)
                .OrderByDescending(o => o.OrderDate)
                .ToList();

            return Ok(orders);
        }

        // GET revenue summary from confirmed orders
        [HttpGet("GetRevenueSummary")]
        public IActionResult GetRevenueSummary()
        {
            List<Order> confimredOrders = context.Orders
                .Where(o => o.Orderstatus == "Confirmed")
                .ToList();

            double totalRevenue = confimredOrders.Sum(o => o.TotalAmount);
            int orderCount = confimredOrders.Count;
            double averageOrder = orderCount > 0 ? totalRevenue / orderCount : 0;

            List<Order> recentOrders = context.Orders
                .OrderByDescending(o => o.OrderDate)
                .Take(10)
                .ToList();

            return Ok(new { totalRevenue, orderCount, averageOrder, recentOrders });
        }
    }
}
