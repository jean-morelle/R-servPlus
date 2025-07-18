using System.ComponentModel.DataAnnotations;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.DTOs
{
    public class ReservationDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ServiceId { get; set; }
        public DateTime DateReservation { get; set; }
        public TimeSpan HeureDebut { get; set; }
        public TimeSpan HeureFin { get; set; }
        public ReservationStatut Statut { get; set; }
        public decimal MontantTotal { get; set; }
        public DateTime DateCreation { get; set; }
        public Guid? PaiementId { get; set; }
        public string? Notes { get; set; }
        
        // Navigation properties
        public UserDto? User { get; set; }
        public ServiceDto? Service { get; set; }
        public PaiementDto? Paiement { get; set; }
    }

    public class CreateReservationDto
    {
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
        [Range(0.01, double.MaxValue, ErrorMessage = "Le montant doit être supérieur à 0")]
        public decimal MontantTotal { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }
    }

    public class UpdateReservationDto
    {
        [Required]
        public DateTime DateReservation { get; set; }

        [Required]
        public TimeSpan HeureDebut { get; set; }

        [Required]
        public TimeSpan HeureFin { get; set; }

        [Required]
        public ReservationStatut Statut { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Le montant doit être supérieur à 0")]
        public decimal MontantTotal { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }
    }

    public class ReservationStatutDto
    {
        public Guid Id { get; set; }
        public ReservationStatut Statut { get; set; }
    }
} 