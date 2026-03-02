using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;

namespace portfolio_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ActivityLogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityLog>>> GetActivityLogs()
        {
            return await _context.ActivityLogs
                .OrderByDescending(a => a.Timestamp)
                .Take(100)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ActivityLog>> CreateActivityLog(ActivityLog activityLog)
        {
            activityLog.Timestamp = DateTime.UtcNow;
            
            // Get IP Address
            activityLog.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            
            _context.ActivityLogs.Add(activityLog);
            await _context.SaveChangesAsync();

            return Ok(activityLog);
        }
    }
}
