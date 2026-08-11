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
    [Route("Payment")]
    public class PaymentController : ControllerBase
    {
        private readonly AppDbContext context;
        private readonly IEmailService emailService;

        public PaymentController(AppDbContext _context, IEmailService _emailService)
        {
            context = _context;
            emailService = _emailService;
        }


        // Create a new payment — called by the Attendee who owns the order
        [HttpPost("AddPayment")]
        [Authorize]
        public async Task<IActionResult> AddPayment([FromBody] PaymentRequest request)
        {
            var order = context.Orders.FirstOrDefault(o => o.OrderId == request.OrderId);
            if (order == null)
                return NotFound("Order not found.");

            var existingPayment = context.Payments
                .FirstOrDefault(existing => existing.OrderId == request.OrderId);
            if (existingPayment != null)
                return BadRequest("This order already has a payment.");

            var payment = new Payment
            {
                PaymentMethod = request.PaymentMethod,
                OrderId = request.OrderId,
                PaymentAmount = order.TotalAmount,
                PaymentStatus = "Completed",
                PaymentDate = DateTime.Now
            };

            context.Payments.Add(payment);

            order.OrderStatus = "Confirmed";

            context.SaveChanges();

            var user = context.Users.FirstOrDefault(u => u.UserId == order.UserId);

            if (user != null)
            {
                string subject = $"Payment Confirmed - Order #{order.OrderId}";
                string body = $"Hi {user.UserName}\n\n" +
                    $"We've received your payment. Here are the details:\n\n" +
                    $"Order ID: {order.OrderId}\n" +
                    $"Payment Method: {payment.PaymentMethod}\n" +
                    $"Amount Paid: {payment.PaymentAmount:F2} OMR\n" +
                    $"Payment Date: {payment.PaymentDate:yyyy-MM-dd HH:mm}\n" +
                    $"Order Status: {order.OrderStatus}\n\n" +
                    $"Your tickets are confirmed. See you at the event!\n\n" +
                    $"HexaCode Team";

                try
                {
                    await emailService.SendEmailAsync(user.Email, subject, body);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Email failed for payment {payment.PaymentId}: {ex.Message}");
                }
            }

            return Ok(payment);
        }


        // Update payment
        [HttpPut("UpdatePayment")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult UpdatePayment(int id, [FromBody] Payment p)
        {
            var paymentData = context.Payments
                .FirstOrDefault(p => p.PaymentId == id);

            if (paymentData == null)
                return NotFound();

            paymentData.PaymentMethod = p.PaymentMethod;
            paymentData.PaymentStatus = p.PaymentStatus;
            paymentData.PaymentAmount = p.PaymentAmount;
            paymentData.PaymentDate = p.PaymentDate;

            context.SaveChanges();

            return Ok(paymentData);
        }


        // Update payment status only
        [HttpPatch("UpdatePaymentStatus")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult UpdatePaymentStatus(int id, [FromBody] string status)
        {
            var paymentData = context.Payments
                .FirstOrDefault(p => p.PaymentId == id);

            if (paymentData == null)
                return NotFound();

            paymentData.PaymentStatus = status;

            if (status == "Refunded" || status == "Failed")
            {
                var order = context.Orders.FirstOrDefault(o => o.OrderId == paymentData.OrderId);
                if (order != null)
                    order.OrderStatus = "Pending";
            }

            context.SaveChanges();

            return Ok(paymentData);
        }


        // Delete payment
        [HttpDelete("DeletePayment")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult DeletePayment(int id)
        {
            var paymentData = context.Payments
                .FirstOrDefault(p => p.PaymentId == id);

            if (paymentData == null)
                return NotFound();

            context.Payments.Remove(paymentData);
            context.SaveChanges();

            return Ok("Payment deleted successfully");
        }


        // Get all payments with order details
        [HttpGet("GetAllPayments")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetAllPayments()
        {
            var payments = context.Payments
                .Include(p => p.Order)
                .ToList();

            return Ok(payments);
        }


        // Get payment by id
        [HttpGet("GetPaymentById")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetPaymentById(int id)
        {
            var payment = context.Payments
                .Include(p => p.Order)
                .FirstOrDefault(p => p.PaymentId == id);

            if (payment == null)
                return NotFound();

            return Ok(payment);
        }


        // Get payments by status
        [HttpGet("FilterPayments")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult FilterPayments(string status)
        {
            var payments = context.Payments
                .Where(p => p.PaymentStatus.Contains(status))
                .ToList();

            return Ok(payments);
        }


        // Sort payments by amount
        [HttpGet("SortPayments")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult SortPayments()
        {
            var payments = context.Payments
                .OrderByDescending(p => p.PaymentAmount)
                .ToList();

            return Ok(payments);
        }
        
        
        
        ///////////////////////////////////////////////
        // Payment Statistics
        [HttpGet("Statistics")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetPaymentStatistics()
        {
            var currentYear = DateTime.Now.Year;
            var currentMonth = DateTime.Now.Month;

            var payments = context.Payments
                .Where(p => p.PaymentStatus == "Completed")
                .ToList();

            var totalRevenue = payments.Sum(p => p.PaymentAmount);

            var monthlyRevenue = payments
                .Where(p =>
                    p.PaymentDate.Year == currentYear &&
                    p.PaymentDate.Month == currentMonth)
                .Sum(p => p.PaymentAmount);

            var yearlyRevenue = payments
                .Where(p => p.PaymentDate.Year == currentYear)
                .Sum(p => p.PaymentAmount);

            var totalPayments = payments.Count();

            return Ok(new
            {
                totalRevenue,
                monthlyRevenue,
                yearlyRevenue,
                totalPayments
            });
        }
        
        
        
        ///////////////////////////////////
        // Payment statistics by user
        [HttpGet("UserStatistics")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetUserPaymentStatistics()
        {
            var statistics = context.Payments
                .Where(p => p.PaymentStatus == "Completed")
                .Include(p => p.Order)
                .ThenInclude(o => o.User)
                .GroupBy(p => new
                {
                    p.Order.UserId,
                    p.Order.User.UserName
                })
                .Select(group => new
                {
                    userId = group.Key.UserId,
                    userName = group.Key.UserName,
                    totalPaid = group.Sum(p => p.PaymentAmount),
                    paymentCount = group.Count()
                })
                .OrderByDescending(x => x.totalPaid)
                .ToList();

            return Ok(statistics);
        }
        
        
        
    }
}