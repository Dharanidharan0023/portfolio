using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;

namespace portfolio_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EducationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EducationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Educations/public
        [HttpGet("public")]
        public async Task<ActionResult<IEnumerable<Education>>> GetPublicEducations()
        {
            return await _context.Educations.OrderBy(e => e.OrderIndex).ToListAsync();
        }

        // GET: api/Educations
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Education>>> GetEducations()
        {
            return await _context.Educations.OrderBy(e => e.OrderIndex).ToListAsync();
        }

        // POST: api/Educations
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Education>> PostEducation(Education education)
        {
            _context.Educations.Add(education);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEducations), new { id = education.Id }, education);
        }

        // PUT: api/Educations/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEducation(int id, Education education)
        {
            if (id != education.Id) return BadRequest();
            _context.Entry(education).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException) { if (!EducationExists(id)) return NotFound(); else throw; }
            return NoContent();
        }

        // DELETE: api/Educations/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEducation(int id)
        {
            var education = await _context.Educations.FindAsync(id);
            if (education == null) return NotFound();
            _context.Educations.Remove(education);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool EducationExists(int id)
        {
            return _context.Educations.Any(e => e.Id == id);
        }
    }
}
