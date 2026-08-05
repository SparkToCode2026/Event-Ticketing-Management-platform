using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Models;
namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("Review")]
    public class ReviewController : ControllerBase
    {
        private AppDbContext context;
        public ReviewController(AppDbContext _context)
        {
            context = _context;
        }

        [HttpPost("AddReview")]
        public IActionResult AddReview([FromBody] Review review)
        {
            review.ReviewDate = DateTime.Now;
            context.Reviews.Add(review);
            context.SaveChanges();

            return Ok(review);
        }

        [HttpPut("UpdateReview")]
        public IActionResult UpdateReview(int id, Review updatedReview)
        {
            var review = context.Reviews.Find(id);

            if (review == null)
                return NotFound();

            review.Comment = updatedReview.Comment;
            review.Rating = updatedReview.Rating;

            context.SaveChanges();

            return Ok(review);
        }

        [HttpPatch("UpdateRating")]
        public IActionResult UpdateRating(int id, int rating)
        {
            var review = context.Reviews.Find(id);

            if (review == null)
                return NotFound();

            review.Rating = rating;

            context.SaveChanges();

            return Ok(review);
        }

        [HttpDelete("DeleteReview")]
        public IActionResult DeleteReview(int id)
        {
            var review = context.Reviews.Find(id);

            if (review == null)
                return NotFound();

            context.Reviews.Remove(review);
            context.SaveChanges();

            return Ok("Review deleted successfully.");
        }

        [HttpGet("List")]
        public IActionResult GetReviews()
        {
            var reviews = context.Reviews
          .Include(r => r.User)
          .ToList();

            return Ok(reviews);
        }
        [HttpGet("FindReviewById")]
        public IActionResult GetReview(int id)
        {
            var review = context.Reviews
           .Include(r => r.User)
           .FirstOrDefault(r => r.ReviewID == id);

            if (review == null)
                return NotFound();

            return Ok(review);
        }
        [HttpGet("FilterReviews")]
        public IActionResult FilterReviews(int minRating)
        {
            var reviews = context.Reviews
          .Where(r => r.Rating >= minRating)
          .Include(r => r.User)
          .ToList();

            return Ok(reviews);
        }

        [HttpGet("sortingReview")]
        public IActionResult ReviewSorting()
        {
            var averageRating = context.Reviews.Average(r => r.Rating);

            var latestReviews = context.Reviews
          .OrderByDescending(r => r.ReviewDate)
          .Include(r => r.User)
          .ToList();

            return Ok(new
            {
                AverageRating = averageRating,
                LatestReviews = latestReviews
            });
        }

    }
}
