using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Helpers;
using Project_Solutions.Models;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("Payment")]
    public class PaymentController : ControllerBase
    {

        // The DbContext is our connection to SQL Server.
        private readonly AppDbContext context;

        public PaymentController(AppDbContext _context)
        {
            context = _context;
        }


        // Create a new payment
        [HttpPost("AddPayment")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult AddPayment([FromBody] Payment p)
        {
            context.Payments.Add(p);
            context.SaveChanges();

            return Ok(p);
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

    }
}