using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class Education
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Institution { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Degree { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string? Description { get; set; }

        public int OrderIndex { get; set; }
    }
}
