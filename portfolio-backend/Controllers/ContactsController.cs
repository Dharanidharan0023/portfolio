using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using portfolio_backend.Data;
using portfolio_backend.Models;
using portfolio_backend.Services;

namespace portfolio_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public ContactsController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpGet("public")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetPublicContacts()
        {
            return await _context.Contacts
                .Where(c => c.IsVisible)
                .OrderBy(c => c.Order)
                .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            return await GetPublicContacts();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();
            return contact;
        }

        public class ContactMessageDto
        {
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Subject { get; set; } = string.Empty;
            public string Message { get; set; } = string.Empty;
        }

        [HttpPost("message")]
        public async Task<IActionResult> SendMessage([FromBody] ContactMessageDto dto)
        {
            try
            {
                // Save to Database
                var message = new ContactMessage
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Subject = dto.Subject,
                    Message = dto.Message,
                    CreatedAt = DateTime.UtcNow
                };
                _context.ContactMessages.Add(message);
                await _context.SaveChangesAsync();

                // Attempt to send email notification
                try
                {
                    await _emailService.SendContactNotificationAsync(
                        dto.Name,
                        dto.Email,
                        dto.Subject,
                        dto.Message
                    );
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine($"Failed to send email notification: {emailEx.Message}");
                    // Still return success since it's saved to the database
                }

                return Ok(new { message = "Message received and stored successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to process message: {ex.Message}");
                return StatusCode(500, "Internal server error while processing message");
            }
        }

        // --- Inbox Endpoints (Admin Only) ---

        [Authorize(Roles = "Admin")]
        [HttpGet("messages")]
        public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
        {
            return await _context.ContactMessages
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("messages/{id}")]
        public async Task<ActionResult<ContactMessage>> GetMessage(int id)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null) return NotFound();

            if (!message.IsRead)
            {
                message.IsRead = true;
                await _context.SaveChangesAsync();
            }

            return message;
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("messages/{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null) return NotFound();

            _context.ContactMessages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Contact>> CreateContact(Contact contact)
        {
            if (contact.Order == 0)
            {
                var maxOrder = await _context.Contacts.MaxAsync(c => (int?)c.Order) ?? 0;
                contact.Order = maxOrder + 1;
            }

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int id, Contact contact)
        {
            if (id != contact.Id) return BadRequest();

            _context.Entry(contact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContactExists(int id) => _context.Contacts.Any(e => e.Id == id);
    }
}
