using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Solutions.Data;
using Project_Solutions.Models;
namespace Project_Solutions.Controllers
{
    
    [ApiController] 
    [Route("speaker")] //=> every action below starts with  https://localhost:7173/speaker/...
    public class SpeakerController  : ControllerBase
    {
        
        
    // The DbContext is our connection to SQL Server.
        private readonly AppDbContext context;
        public SpeakerController(AppDbContext _context)
        {
            context = _context;
        }
        
        
        // Create a new speaker
        // Request URL https://localhost:7173/speaker/AddSpeaker
        // Request method => Post and  Request Body 
        [HttpPost("AddSpeaker")]
        public IActionResult AddSpeaker([FromBody] Speaker S)
        {
            context.Speakers.Add(S);
            context.SaveChanges();

            return Ok(S);
        }
        
        
        // Update speaker
        // Request URL https://localhost:7173/speaker/UpdateSpeaker?id=3
        // Request method => Put
        [HttpPut("UpdateSpeaker")]
        public IActionResult UpdateSpeaker(int id, [FromBody] Speaker s)
        {
            var speakerData = context.Speakers
                .FirstOrDefault(s => s.SpeakerId == id);

            if (speakerData == null)
                return NotFound();

            speakerData.SpeakerName = s.SpeakerName;
            speakerData.SpeakerBio = s.SpeakerBio;
            speakerData.SpeakerTopic = s.SpeakerTopic;

            context.SaveChanges();
            return Ok(speakerData);
            
        }
        
        
        // Update speaker topic only
        [HttpPatch("UpdateSpeakerTopic")]
        public IActionResult UpdateSpeakerTopic(int id, [FromBody] string topic)
        {
            var speakerData = context.Speakers
                .FirstOrDefault(s => s.SpeakerId == id);

            if (speakerData == null)
                return NotFound();

            speakerData.SpeakerTopic = topic;

            context.SaveChanges();
            return Ok(speakerData);
        }
        
        
        // Delete speaker // Request Body   => empty
        // Request URL https://localhost:7173/speaker/DeleteSpeaker?id=3
        [HttpDelete("DeleteSpeaker")]
        public IActionResult DeleteSpeaker(int id)
        
        {
            var speakerData = context.Speakers
            .FirstOrDefault(s => s.SpeakerId == id);
            if (speakerData == null)
                return NotFound();

            context.Speakers.Remove(speakerData);
            context.SaveChanges();

            return Ok("Speaker deleted successfully");
        
        }
        
        
        
        
        // Get all speakers with event details
        //URL https://localhost:7173/speaker/GetAllSpeakers
        [HttpGet ("GetAllSpeakers")]
        public IActionResult GetAllSpeakers()
        {
            var speakers = context.Speakers
                .Include(s => s.Event)
                .ToList();

            return Ok(speakers);
        }
        
        // Get speaker by id
        //URL https://localhost:7173/speaker/GetSpeakerById?id=3
        [HttpGet("GetSpeakerById")]
        public IActionResult GetSpeakerById(int id)
        {
            var speaker = context.Speakers
                .Include(s => s.Event)
                .FirstOrDefault(s => s.SpeakerId == id);

            if (speaker == null)
                return NotFound();

            return Ok(speaker);
        }
        
        // Get speakers by topic
        [HttpGet("GetSpeakersByTopic")]
        public IActionResult GetSpeakersByTopic(string topic)
        {
            var speakers = context.Speakers
                .Where(s => s.SpeakerTopic.Contains(topic))
                .ToList();

            return Ok(speakers);
        }
        
        // Sort speakers by name
        [HttpGet("SortSpeakers")]
        public IActionResult SortSpeakers()
        {
            var speakers = context.Speakers
                .OrderBy(s => s.SpeakerName)
                .ToList();

            return Ok(speakers);
        }
        
        
    }
}