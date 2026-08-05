using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
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
        //[HttpPost("AddPromotion")]
        //public IActionResult AddPromotion([FromBody]Promotion promotion)
        //{
        //    var existingPromotion = context.Promotions
        //        .FirstOrDefault(p => p.OrderId == promotion.OrderId);

        //    if (existingPromotion != null)
        //    {
        //     return BadRequest("This order already has a promotion.");   
        //    }
        //    context.Promotions.Add(promotion);
        //    context.SaveChanges();

        //    return Ok(promotion);
        //}
        [HttpPut("UpdatePromotion")]
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
        public IActionResult GetPromotions()
        { 
          var promotions = context.Promotions
          .Include(p => p.Orders)
          .ToList();

            return Ok(promotions);
        }
        [HttpGet("FindPromotionById")]
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
        public IActionResult GetActivePromotions()
        {
          var promotions = context.Promotions
          .Where(p => p.PromotionExpiry >= DateTime.Now)
         .Include(p => p.Orders)
          .ToList();

            return Ok(promotions);
        }
        [HttpGet("sortingPromotion")]
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
