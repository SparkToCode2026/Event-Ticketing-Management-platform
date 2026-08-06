using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Models;
using Project_Solutions.Services.Email;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("Order")]
    public class OrderController : ControllerBase
    {
        private IEmailService emailService;
        private AppDbContext context;
        public OrderController(AppDbContext _context, IEmailService _emailService)
        {
            context = _context;
            emailService = _emailService;
        }

        // POST: Order/AddOrder
        [HttpPost("AddOrder")]
        [Authorize]
        public async Task<IActionResult> AddOrder(Order order)
        {
            // user email for email notification
            User user = context.Users.FirstOrDefault(u => u.UserId == order.UserId);
            if (user == null) {
                return NotFound($"User with id: {order.UserId} not found");
            }

            // verify promotion id provided
            if (order.PromotionId.HasValue)
            {
                var promoExists = context.Promotions.Any(p => p.PromotionId == order.PromotionId.Value);
                if (!promoExists)
                {
                    return NotFound($"Promotion with id: {order.PromotionId.Value} not found");
                }
            }

            // set defaults
            order.OrderDate = DateTime.Now;
            if (string.IsNullOrEmpty(order.OrderStatus))
            {
                order.OrderStatus = "Pending";
            }

            // add order to database
            context.Orders.Add(order);
            context.SaveChanges();

            // send email notification
            string subject = $"Your HexaCode Order #{order.OrderId} - Confimation";
            string body = $"Hi {user.UserName}\n\n" +
                $"Thank you for your order!\n\n" +
                $"Order ID: {order.OrderId}\n" +
                $"Order Date: {order.OrderDate:yyyy-MM-dd HH:mm}\n" +
                $"Total Amount: {order.TotalAmount:F2} OMR\n" +
                $"Order Status: {order.OrderStatus}\n\n" +
                $"Your tickets will be issued shortly and will be available in your account.\n\n" +
                $"See you at the event!\n\n" +
                $"HexaCode Team";

            // send it
            try
            {
                await emailService.SendEmailAsync(user.Email, subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email failed for order {order.OrderId}: {ex.Message}");
            }

            return Ok($"Order added successfully with id: {order.OrderId}. Confirmation email sent to {user.Email}");
        }

        // PUT: Full update
        [HttpPut("UpdateOrder")]
        [Authorize]
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
                order.OrderStatus = o.OrderStatus;
                order.UserId = o.UserId;
                order.PromotionId = o.PromotionId;

                context.SaveChanges();

                return Ok($"Order with id: {id} updated successfully");
            }
        }

        // PATCH: Partial update
        [HttpPatch("UpdateOrderAmount")]
        [Authorize]
        public IActionResult UpdateOrderAmount(int id, decimal newAmount)
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
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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
        [Authorize]
        public IActionResult GetRevenueSummary()
        {
            List<Order> confimredOrders = context.Orders
                .Where(o => o.OrderStatus == "Confirmed")
                .ToList();

            decimal totalRevenue = confimredOrders.Sum(o => o.TotalAmount);
            int orderCount = confimredOrders.Count;
            decimal averageOrder = orderCount > 0 ? totalRevenue / orderCount : 0;

            List<Order> recentOrders = context.Orders
                .OrderByDescending(o => o.OrderDate)
                .Take(10)
                .ToList();

            return Ok(new { totalRevenue, orderCount, averageOrder, recentOrders });
        }
    }
}
