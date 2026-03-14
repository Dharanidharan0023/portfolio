using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;

namespace portfolio_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProfilesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Profiles/public
        [HttpGet("public")]
        public async Task<ActionResult<Profile>> GetPublicProfile()
        {
            var profile = await _context.Profiles.FirstOrDefaultAsync();
            if (profile == null) return NotFound();
            return profile;
        }

        // GET: api/Profiles (Admin)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<Profile>> GetProfile()
        {
            return await GetPublicProfile();
        }

        // PUT: api/Profiles/1
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, Profile profile)
        {
            if (id != profile.Id) return BadRequest();

            _context.Entry(profile).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProfileExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // POST: api/Profiles
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Profile>> CreateProfile(Profile profile)
        {
            if (await _context.Profiles.AnyAsync()) 
                return BadRequest("Profile already exists. Use PUT to update.");

            _context.Profiles.Add(profile);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProfile), new { id = profile.Id }, profile);
        }

        private bool ProfileExists(int id) => _context.Profiles.Any(e => e.Id == id);
    }
}
