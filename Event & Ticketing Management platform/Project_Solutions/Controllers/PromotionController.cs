using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Helpers;
using Project_Solutions.Models;
namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("Promotion")]
    public class PromotionController:ControllerBase
    {
        private AppDbContext context;
        public PromotionController(AppDbContext _context)
        {
        context = _context;
        }

        [HttpPost("AddPromotion")]
        [Authorize]
        public IActionResult AddPromotion(int orderId,[FromBody]Promotion promotion)
        {
         var order = context.Orders.FirstOrDefault(o => o.OrderId == orderId);

         if (order == null)
            {
                return NotFound("Order not found.");
            }

            if (order.PromotionId != null)
            {
                return BadRequest("This order already has a promotion.");
            }
            context.Promotions.Add(promotion);
            context.SaveChanges();
            
            order.PromotionId = promotion.PromotionId;
            context.SaveChanges();

            return Ok(promotion);
        }

        [HttpPut("UpdatePromotion")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult UpdatePromotion(int id, [FromBody]Promotion updatedPromotion)
        {
            var promotion = context.Promotions.Find(id);

            if (promotion == null)
                return NotFound();

            promotion.PromotionCode = updatedPromotion.PromotionCode;
            promotion.PromotionType = updatedPromotion.PromotionType;

            context.SaveChanges();

            return Ok(promotion);
        }

        [HttpPatch("UpdateExpiryDate")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult UpdateExpiryDate(int id, DateTime expiryDate)
        {
            var promotion = context.Promotions.Find(id);

            if (promotion == null)
                return NotFound();

            promotion.PromotionExpiry = expiryDate;

            context.SaveChanges();

            return Ok(promotion);
        }

        [HttpDelete("DeletePromotion")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult DeletePromotion(int id)
        {
          var promotion = context.Promotions.Find(id);

          if (promotion == null)
               return NotFound();

          context.Promotions.Remove(promotion);
          context.SaveChanges();

         return Ok("Promotion deleted successfully.");
        }

        [HttpGet("list")]
        [Authorize]
        public IActionResult GetPromotions()
        { 
          var promotions = context.Promotions
          .Include(p => p.Orders)
          .ToList();

            return Ok(promotions);
        }

        [HttpGet("FindPromotionById")]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetPromotion(int id)
        {
           var promotion = context.Promotions
         .Include(p => p.Orders)
         .FirstOrDefault(p => p.PromotionId == id);

            if (promotion == null)
               return NotFound();

          return Ok(promotion);
        }

        [HttpGet("ActivePromotions")]
        [Authorize]
        public IActionResult GetActivePromotions()
        {
          var promotions = context.Promotions
          .Where(p => p.PromotionExpiry >= DateTime.Now)
         .Include(p => p.Orders)
          .ToList();

            return Ok(promotions);
        }

        [HttpGet("sortingPromotion")]
        [Authorize]
        public IActionResult sortingPromotion()
        {
            var sortingPromotion = context.Promotions
                .GroupBy(p => p.PromotionType)
                .Select(g => new
                {
                    PromotionType = g.Key,
                    Count = g.Count()
                })
                .ToList();

            return Ok(sortingPromotion);
        }
    }
}
