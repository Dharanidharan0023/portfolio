using System;
using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class Experience
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Company { get; set; } = string.Empty;

        [Required]
        [StringLength(150)]
        public string Role { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsCurrent { get; set; } = false;

        public string? Description { get; set; }
        
        public int Order { get; set; } = 0;

        public bool IsVisible { get; set; } = true;
    }
}
