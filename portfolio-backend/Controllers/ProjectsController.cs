using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;

namespace portfolio_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("public")]
        public async Task<ActionResult<IEnumerable<Project>>> GetPublicProjects()
        {
            return await _context.Projects
                .Where(p => p.IsVisible)
                .OrderByDescending(p => p.Order)
                .ThenByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            return await _context.Projects
                .OrderByDescending(p => p.Order)
                .ThenByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();
            return project;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            project.CreatedAt = DateTime.UtcNow;
            if (project.Order == 0)
            {
                var maxOrder = await _context.Projects.MaxAsync(p => (int?)p.Order) ?? 0;
                project.Order = maxOrder + 1;
            }

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPublicProjects), new { id = project.Id }, project);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, Project project)
        {
            if (id != project.Id) return BadRequest();

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id)) return NotFound();
                else throw;
            }

            return Ok(project);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/toggle-visibility")]
        public async Task<IActionResult> ToggleVisibility(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            project.IsVisible = !project.IsVisible;
            await _context.SaveChangesAsync();

            return Ok(new { project.Id, project.IsVisible });
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/order")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] int order)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            project.Order = order;
            await _context.SaveChangesAsync();

            return Ok(new { project.Id, project.Order });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id) => _context.Projects.Any(e => e.Id == id);
    }
}
