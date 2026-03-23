using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class Skill
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string Category { get; set; } = "General"; // Frontend, Backend, etc.

        public int ProficiencyLevel { get; set; } = 0; // e.g. 0-100 or 1-5
        
        public string? IconUrl { get; set; }
        
        public int Order { get; set; } = 0;

        public bool IsVisible { get; set; } = true;
    }
}
