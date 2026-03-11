using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;
using System.Text.Json;

namespace portfolio_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExperiencesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExperiencesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("public")]
        public async Task<ActionResult<IEnumerable<Experience>>> GetPublicExperiences()
        {
            return await _context.Experiences
                .OrderBy(e => e.OrderIndex)
                .ThenByDescending(e => e.StartDate)
                .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Experience>>> GetExperiences()
        {
            return await GetPublicExperiences();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Experience>> GetExperience(int id)
        {
            var exp = await _context.Experiences.FindAsync(id);
            if (exp == null) return NotFound();
            return exp;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Experience>> CreateExperience(Experience experience)
        {
            if (experience.OrderIndex == 0)
            {
                var maxOrder = await _context.Experiences.MaxAsync(e => (int?)e.OrderIndex) ?? 0;
                experience.OrderIndex = maxOrder + 1;
            }

            _context.Experiences.Add(experience);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExperience), new { id = experience.Id }, experience);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Experience>> UpdateExperience(int id, Experience experience)
        {
            if (id != experience.Id) return BadRequest();

            _context.Entry(experience).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExperienceExists(id)) return NotFound();
                else throw;
            }

            // ✅ Return updated object instead of NoContent
            return Ok(experience);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExperience(int id)
        {
            var exp = await _context.Experiences.FindAsync(id);
            if (exp == null) return NotFound();

            _context.Experiences.Remove(exp);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExperienceExists(int id) => _context.Experiences.Any(e => e.Id == id);
    }
}
