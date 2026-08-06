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
        public async Task<IActionResult> AddOrder(OrderRequest request)
        {
            decimal total = 0;
            var ticketsToCreate = new List<Ticket>();

            foreach (var item in request.Items)
            {
                if (item.Quantity <= 0)
                {
                    return BadRequest($"Invalid quantity for ticket type {item.TicketTypeId}");
                }

                var ticketType = await context.TicketTypes.FindAsync(item.TicketTypeId);
                if (ticketType == null)
                {
                    return BadRequest($"Invalid ticket type: {item.TicketTypeId}");
                }

                total += ticketType.Price * item.Quantity;

                for (int i = 0; i < item.Quantity; i++)
                {
                    ticketsToCreate.Add(new Ticket
                    {
                        IsUsed = false,
                        IssuedAt = DateTime.Now,
                        TicketTypeId = item.TicketTypeId
                    });
                }
            }

            var order = new Order
            {
                UserId = request.UserId,
                OrderDate = DateTime.Now,
                OrderStatus = "Pending",
                TotalAmount = total
            };

            context.Orders.Add(order);
            await context.SaveChangesAsync();

            foreach (var ticket in ticketsToCreate)
            {
                ticket.OrderId = order.OrderId;
                context.Tickets.Add(ticket);
            }
            await context.SaveChangesAsync();

            var user = await context.Users.FindAsync(order.UserId);
            string subject = $"Your HexaCode Order #{order.OrderId} - Confirmation";
            string body = $"Hi {user.UserName}\n\n" +
                $"Thank you for your order!\n\n" +
                $"Order ID: {order.OrderId}\n" +
                $"Order Date: {order.OrderDate:yyyy-MM-dd HH:mm}\n" +
                $"Total Amount: {order.TotalAmount:F2} OMR\n" +
                $"Order Status: {order.OrderStatus}\n\n" +
                $"Your tickets will be issued shortly and will be available in your account.\n\n" +
                $"See you at the event!\n\n" +
                $"HexaCode Team";

            try
            {
                await emailService.SendEmailAsync(user.Email, subject, body);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email failed for order {order.OrderId}: {ex.Message}");
            }

            return Ok(new { orderId = order.OrderId, totalAmount = order.TotalAmount });
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
            List<Order> confirmedOrders = context.Orders
                .Where(o => o.OrderStatus == "Confirmed")
                .ToList();

            decimal totalRevenue = confirmedOrders.Sum(o => o.TotalAmount);
            int orderCount = confirmedOrders.Count;
            decimal averageOrder = orderCount > 0 ? totalRevenue / orderCount : 0;

            List<Order> recentOrders = context.Orders
                .OrderByDescending(o => o.OrderDate)
                .Take(10)
                .ToList();

            return Ok(new { totalRevenue, orderCount, averageOrder, recentOrders });
        }
    }
}
