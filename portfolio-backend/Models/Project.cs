using System;
using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        
        public string? ImageUrl { get; set; }
        
        public string? ProjectUrl { get; set; }
        
        public string? GithubUrl { get; set; }

        public string? TechStack { get; set; }
        
        public int OrderIndex { get; set; } = 0;
        
        public bool IsPublished { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
