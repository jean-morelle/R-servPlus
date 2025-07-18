using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RéservPlus.Domain.Models
{
    [Table("Prestataires")]
    public class Prestataire
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(200)]
        public string NomCommercial { get; set; } = default!;
        
        [Required]
        [StringLength(500)]
        public string Adresse { get; set; } = default!;
        
        [Required]
        [StringLength(20)]
        public string Telephone { get; set; } = default!;
        
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = default!;
        
        // Navigation properties
        public virtual ICollection<Service> Services { get; set; } = new List<Service>();
    }
}
