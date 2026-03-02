using System;

namespace portfolio_backend.Models
{
    public class About
    {
        public int Id { get; set; }

        public string? Description { get; set; }

        // Store JSON or comma-separated highlights
        public string? Highlights { get; set; } 

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
