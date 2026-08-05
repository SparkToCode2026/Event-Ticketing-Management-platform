using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Models;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("EventCategory")]
    public class EventCategoryController : ControllerBase
    {
        private AppDbContext _appDbContext;

        public EventCategoryController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        //1: create a new event category
        [HttpPost("AddEventCategory")]
        public void AddEventCategory(EventCategory category)
        {
            _appDbContext.EventCategories.Add(category);
            _appDbContext.SaveChanges();
        }

        //2: update name and description of an existing event category
        [HttpPut("UpdateEventCategory/{id}")]
        public void UpdateEventCategory(int id, EventCategory updatedCategory)
        {
            var existingCategory = _appDbContext.EventCategories.Find(id);

            if (existingCategory != null)
            {
                existingCategory.EventCategoryName = updatedCategory.EventCategoryName;
                existingCategory.EventCategoryDescription = updatedCategory.EventCategoryDescription;

                _appDbContext.SaveChanges();
            }
        }

        //3: delete an existing event category
        [HttpDelete("DeleteEventCategory/{id}")]
        public void DeleteEventCategory(int id) {
            var existingCategory = _appDbContext.EventCategories.Find(id);

            if (existingCategory != null)
            {
                _appDbContext.EventCategories.Remove(existingCategory);
                _appDbContext.SaveChanges();
            }
        }






    }
}