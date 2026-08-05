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


        //4: get all event categories
        [HttpGet("GetAllEventCategories")]
        public List<EventCategory> GetEventCategories()
        {
            return _appDbContext.EventCategories
                .Include(c => c.Events)
                .ToList();
        }

        //5: Patch an existing event and event category to reassign the event to a different category
        [HttpPatch("ReassignEvent/{eventId}/{categoryId}")]
        public void ReassignEvent(int eventId, int categoryId)
        {
            var existingEvent = _appDbContext.Events.Find(eventId);

            if (existingEvent != null)
            {
                existingEvent.EventCategoryId = categoryId;
                _appDbContext.SaveChanges();
            }
        }

        //6: find category by id
        [HttpGet("GetEventCategoryById/{id}")]
        public EventCategory GetEventCategoryById(int id)
        {
            return _appDbContext.EventCategories
                .FirstOrDefault(c => c.EventCategoryId == id);
        }


        //7: filter/search event categories by keyword
        [HttpGet("SearchEventCategories")]
        public List<EventCategory> SearchEventCategories(string keyword)
        {
            return _appDbContext.EventCategories
                .Where(c => c.EventCategoryName.Contains(keyword) || c.EventCategoryDescription.Contains(keyword))
                .ToList();
        }

        //8: GET list of category count of events
        [HttpGet("GetCategoryEventCounts")]
        public object GetCategoryEventCounts()
        {
            var result = _appDbContext.EventCategories
                .Include(c => c.Events)
                .Select(c => new
                {
                    CategoryName = c.EventCategoryName,
                    EventCount = c.Events.Count()
                })
                .ToList();

            return result;
        }



    }
}