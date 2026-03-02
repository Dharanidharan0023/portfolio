using System;
using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class Achievement
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime DateAchieved { get; set; }

        [StringLength(150)]
        public string? Issuer { get; set; }

        public string? BadgeUrl { get; set; }
        
        public string? Url { get; set; }

        public int OrderIndex { get; set; } = 0;
        
        public bool IsPublished { get; set; } = true;
    }
}
