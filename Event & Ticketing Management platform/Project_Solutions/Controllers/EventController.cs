using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Models;
using Project_Solutions.Data;

namespace Project_Solutions.Controllers
{
    [ApiController]
    [Route("Event")]
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

        //3: Reschedule an event
        [HttpPatch("RescheduleEvent/{id}")]
        public void RescheduleEvent(int id, Event updatedEvent)
        {
            var existingEvent = _appDbContext.Events.Find(id);

            if (existingEvent != null)
            {
                existingEvent.EventDate = updatedEvent.EventDate;
                existingEvent.EventStartTime = updatedEvent.EventStartTime;
                existingEvent.EventEndTime = updatedEvent.EventEndTime;

                _appDbContext.SaveChanges();
            }
        }


        //4: delete an event
        [HttpDelete("DeleteEvent/{id}")]
        public void DeleteEvent(int id)
        {
            var existingEvent = _appDbContext.Events.Find(id);

            if (existingEvent != null)
            {
                _appDbContext.Events.Remove(existingEvent);
                _appDbContext.SaveChanges();
            }
        }

        //5: get all events
        [HttpGet("GetEvents")]
        public List<Event> GetEvents()
        {
            return _appDbContext.Events
                .Include(e => e.Venue)
                .Include(e => e.Speakers)
                .Include(e => e.EventCategory)
                .ToList();
        }

        //6: get event by id
        [HttpGet("GetEventById/{id}")]
        public Event? GetEventById(int id)
        {
            return _appDbContext.Events
                .Include(e => e.Venue)
                .Include(e => e.Speakers)
                .Include(e => e.EventCategory)
                .Include(e => e.OrganizerProfile)
                .Include(e => e.TicketType)
                .Include(e => e.Reviews)
                .FirstOrDefault(e => e.EventId == id);
        }

        //7: get upcoming events
        [HttpGet("GetUpcomingEvents")]
        public List<Event> GetUpcomingEvents()
        {
            return _appDbContext.Events
                .Where(e => e.EventDate >= DateTime.Now)
                .ToList();
        }

        //8: get event Summry
        [HttpGet("GetEventSummary/{id}")]
        public object GetEventsSummary()
        {
            var events = _appDbContext.Events
                .OrderBy(e => e.EventDate)
                .ToList();

            var totalCount = _appDbContext.Events.Count();

            return new
            {
                TotalEvents = totalCount,
                Events = events
            };
        }


    }
}
