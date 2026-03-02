using System.ComponentModel.DataAnnotations;

namespace portfolio_backend.Models
{
    public class Profile
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        public string? Bio { get; set; }
        
        public string? AvatarUrl { get; set; }
        
        public string? ResumeUrl { get; set; }

        public string? LeadershipTitle { get; set; }
        public string? LeadershipBio { get; set; }
    }
}
