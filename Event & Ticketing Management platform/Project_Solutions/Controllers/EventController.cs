using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Models;

using Project_Solutions.Data;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase   
    {
        private AppDbContext _appDbContext;
        public EventController(AppDbContext appDbContext) { 
            _appDbContext = appDbContext;

        }

        //1: Add a new event
        [HttpPost("AddEvent")]
        public void AddEvent(Event e)
        {
            _appDbContext.Events.Add(e);
            _appDbContext.SaveChanges();
        }
    }
}
