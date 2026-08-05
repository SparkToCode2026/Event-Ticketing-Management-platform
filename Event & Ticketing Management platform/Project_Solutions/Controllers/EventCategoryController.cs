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



    }
}