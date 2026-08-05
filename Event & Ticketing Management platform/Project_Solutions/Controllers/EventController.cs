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

        //2: update an existing event
        [HttpPut("UpdateEvent/{id}")]
        public void UpdateEvent(int id, Event updatedEvent)
        {
            var existingEvent = _appDbContext.Events.Find(id);

            if (existingEvent != null)
            {
                existingEvent.EventName = updatedEvent.EventName;
                existingEvent.EventDate = updatedEvent.EventDate;
                existingEvent.EventStartTime = updatedEvent.EventStartTime;
                existingEvent.EventEndTime = updatedEvent.EventEndTime;
                existingEvent.EventDescription = updatedEvent.EventDescription;
                existingEvent.EventCategoryId = updatedEvent.EventCategoryId;
                existingEvent.OrganizerId = updatedEvent.OrganizerId;
                existingEvent.VenueId = updatedEvent.VenueId;

                _appDbContext.SaveChanges();
            }
        }

    }
}
