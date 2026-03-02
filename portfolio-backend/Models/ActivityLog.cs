using System;
using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class ActivityLog
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Action { get; set; } = string.Empty; // e.g., "Created", "Updated", "Deleted"

        [Required]
        [StringLength(50)]
        public string Entity { get; set; } = string.Empty; // e.g., "Project", "Skill"

        public int? EntityId { get; set; }

        public int? UserId { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [StringLength(50)]
        public string? IpAddress { get; set; }
    }
}
