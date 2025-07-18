using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RéservPlus.Domain.Models
{
    [Table("Disponibilites")]
    public class Disponibilite
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public DateTime Date { get; set; }
        
        [Required]
        public TimeSpan HeureDebut { get; set; }
        
        [Required]
        public TimeSpan HeureFin { get; set; }
        
        [Required]
        public bool EstDisponible { get; set; }
        
        [Required]
        public Guid ServiceId { get; set; }
        
        // Navigation properties
        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; } = default!;
        
        // Computed properties
        [NotMapped]
        public DateTime DateHeureDebut => Date.Date + HeureDebut;

        [NotMapped]
        public DateTime DateHeureFin => Date.Date + HeureFin;
    }
}
