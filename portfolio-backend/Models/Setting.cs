using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class Setting
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Key { get; set; } = string.Empty;

        public string? Value { get; set; }
    }
}
