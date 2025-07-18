using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RéservPlus.Domain.Models
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Titre { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Message { get; set; } = string.Empty;

        [Required]
        public NotificationType Type { get; set; }

        [Required]
        public bool Lu { get; set; } = false;

        [Required]
        public DateTime DateCreation { get; set; } = DateTime.UtcNow;

        public DateTime? DateLecture { get; set; }

        [StringLength(200)]
        public string? Lien { get; set; }

        public Guid? ReservationId { get; set; }

        public Guid? PaiementId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = default!;
        
        [ForeignKey("ReservationId")]
        public virtual Reservation? Reservation { get; set; }
        
        [ForeignKey("PaiementId")]
        public virtual Paiement? Paiement { get; set; }
    }

    public enum NotificationType
    {
        Info,
        Reservation,
        Paiement,
        System
    }
} 