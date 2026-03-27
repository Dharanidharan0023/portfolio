using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace portfolio_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VisitorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/visitors/track
        [HttpPost("track")]
        public async Task<IActionResult> TrackVisit()
        {
            try {
                // Get IP address from request
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                var userAgent = Request.Headers["User-Agent"].ToString();

                // Simple check to avoid double-counting same IP within a 24-hour window
                var lastVisit = await _context.Visitors
                    .Where(v => v.IpAddress == ipAddress)
                    .OrderByDescending(v => v.Timestamp)
                    .FirstOrDefaultAsync();

                if (lastVisit == null || (DateTime.UtcNow - lastVisit.Timestamp).TotalHours >= 24)
                {
                    var visitor = new Visitor
                    {
                        IpAddress = ipAddress,
                        UserAgent = userAgent.Length > 100 ? userAgent.Substring(0, 100) : userAgent,
                        Timestamp = DateTime.UtcNow
                    };

                    _context.Visitors.Add(visitor);
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Visit tracked successfully" });
                }

                return Ok(new { message = "Visit already recorded recently" });
            }
            catch (Exception ex) {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/visitors/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try {
                var totalVisitors = await _context.Visitors.CountAsync();
                var todayVisitors = await _context.Visitors
                    .Where(v => v.Timestamp >= DateTime.UtcNow.Date)
                    .CountAsync();

                return Ok(new { 
                    TotalVisitors = totalVisitors,
                    TodayVisitors = todayVisitors
                });
            }
            catch (Exception ex) {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
