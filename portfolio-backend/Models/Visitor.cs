using System;
using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class Visitor
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string IpAddress { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string? UserAgent { get; set; }
    }
}
