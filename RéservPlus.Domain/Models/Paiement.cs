using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RéservPlus.Domain.Models
{
    [Table("Paiements")]
public class Paiement
{
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column(TypeName = "decimal(18,2)")]
    public decimal Montant { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
    public PaiementStatut Statut { get; set; }

        [Required]
        public Guid ReservationId { get; set; }

        [Required]
    public MethodePaiement Methode { get; set; }

        // Navigation properties
        [ForeignKey("ReservationId")]
        public virtual Reservation Reservation { get; set; } = default!;
    }
}
