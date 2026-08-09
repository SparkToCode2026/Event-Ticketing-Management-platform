using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Helpers;
using Project_Solutions.Models;
using Project_Solutions.Services.Email;
using System.Security.Claims;

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
            // Get the logged-in user's ID from their JWT token, not the request body
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid or missing user token.");
            }

            var user = await context.Users.FindAsync(userId);
            if (user == null)
            {
                return BadRequest("Invalid user.");
            }

            decimal total = 0;
            var ticketsToCreate = new List<Ticket>();

            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest("Order must contain at least one item.");
            }

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
                UserId = userId,   // ← from the token, not request.UserId
                OrderDate = DateTime.Now,
                OrderStatus = "Pending",
                TotalAmount = total
            };

            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                context.Orders.Add(order);
                await context.SaveChangesAsync();

                foreach (var ticket in ticketsToCreate)
                {
                    ticket.OrderId = order.OrderId;
                    context.Tickets.Add(ticket);
                }
                await context.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

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
        [Authorize(Roles = Roles.Admin)]
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
        [HttpGet("GetOrderById/{id}")]
        [Authorize]
        public IActionResult GetOrderById(int id)
        {
            var order = context.Orders.FirstOrDefault(o => o.OrderId == id);
            if (order == null) return NotFound();

            var callerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var isAdmin = User.IsInRole(Roles.Admin);

            if (order.UserId != callerId && !isAdmin)
            {
                return Forbid();
            }

            return Ok(order);
        }

        // GET by user id
        [HttpGet("GetOrdersByUserId")]
        [Authorize(Roles = Roles.Admin)]
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
        [Authorize(Roles = Roles.Admin)]
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
