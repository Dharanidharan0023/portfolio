using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class Contact
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // e.g., Email, Phone, LinkedIn, GitHub

        [Required]
        [StringLength(255)]
        public string Value { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? Label { get; set; }
        
        public string? IconUrl { get; set; }
        
        public int OrderIndex { get; set; } = 0;
    }
}
