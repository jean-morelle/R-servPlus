using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RéservPlus.Domain.Models
{
    [Table("Reservations")]
    public class Reservation
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid ServiceId { get; set; }

        [Required]
        public DateTime DateReservation { get; set; }

        [Required]
        public TimeSpan HeureDebut { get; set; }

        [Required]
        public TimeSpan HeureFin { get; set; }

        [Required]
        public ReservationStatut Statut { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MontantTotal { get; set; }

        [Required]
        public DateTime DateCreation { get; set; } = DateTime.UtcNow;

        public Guid? PaiementId { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = default!;
        
        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; } = default!;
        
        [ForeignKey("PaiementId")]
        public virtual Paiement? Paiement { get; set; }
    }
}