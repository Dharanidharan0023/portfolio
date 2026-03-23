using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;

namespace portfolio_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AchievementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AchievementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("public")]
        public async Task<ActionResult<IEnumerable<Achievement>>> GetPublicAchievements()
        {
            return await _context.Achievements
                .Where(a => a.IsVisible && a.IsFeatured)
                .OrderBy(a => a.Order)
                .ThenByDescending(a => a.DateAchieved)
                .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Achievement>>> GetAchievements()
        {
            return await _context.Achievements
                .OrderBy(a => a.Order)
                .ThenByDescending(a => a.DateAchieved)
                .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Achievement>> GetAchievement(int id)
        {
            var ach = await _context.Achievements.FindAsync(id);
            if (ach == null) return NotFound();
            return ach;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Achievement>> CreateAchievement(Achievement achievement)
        {
            if (achievement.Order == 0)
            {
                var maxOrder = await _context.Achievements.MaxAsync(a => (int?)a.Order) ?? 0;
                achievement.Order = maxOrder + 1;
            }

            _context.Achievements.Add(achievement);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPublicAchievements), new { id = achievement.Id }, achievement);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAchievement(int id, Achievement achievement)
        {
            if (id != achievement.Id) return BadRequest();

            _context.Entry(achievement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AchievementExists(id)) return NotFound();
                else throw;
            }

            return Ok(achievement);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAchievement(int id)
        {
            var ach = await _context.Achievements.FindAsync(id);
            if (ach == null) return NotFound();

            _context.Achievements.Remove(ach);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AchievementExists(int id) => _context.Achievements.Any(e => e.Id == id);
    }
}
