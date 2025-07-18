using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RéservPlus.Domain.Models
{
    [Table("Services")]
    public class Service
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(200)]
        public string Nom { get; set; } = default!;
        
        [Required]
        [StringLength(100)]
        public string Type { get; set; } = default!; // hotel, restaurant, coiffeur, etc.
        
        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = default!;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Prix { get; set; }
        
        [Required]
        public Guid PrestataireId { get; set; }
        
        // Navigation properties
        [ForeignKey("PrestataireId")]
        public virtual Prestataire Prestataire { get; set; } = default!;
        
        public virtual ICollection<Disponibilite> Disponibilites { get; set; } = new List<Disponibilite>();
        
        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
