using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;

namespace portfolio_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AboutsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AboutsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("public")]
        public async Task<ActionResult<About>> GetPublicAbout()
        {
            var about = await _context.Abouts.FirstOrDefaultAsync();
            if (about == null) return NotFound();
            return about;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<About>> GetAbout()
        {
            return await GetPublicAbout();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAbout(int id, About about)
        {
            if (id != about.Id) return BadRequest();

            about.UpdatedAt = DateTime.UtcNow;
            _context.Entry(about).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AboutExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<About>> CreateAbout(About about)
        {
            if (await _context.Abouts.AnyAsync()) return BadRequest("About section already exists");

            _context.Abouts.Add(about);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAbout), new { id = about.Id }, about);
        }

        private bool AboutExists(int id) => _context.Abouts.Any(e => e.Id == id);
    }
}
