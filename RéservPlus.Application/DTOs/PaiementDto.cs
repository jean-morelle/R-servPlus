using System.ComponentModel.DataAnnotations;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.DTOs
{
    public class PaiementDto
    {
        public Guid Id { get; set; }
        public decimal Montant { get; set; }
        public DateTime Date { get; set; }
        public PaiementStatut Statut { get; set; }
        public Guid ReservationId { get; set; }
        public MethodePaiement Methode { get; set; }
        public ReservationDto? Reservation { get; set; }
    }

    public class CreatePaiementDto
    {
        public decimal Montant { get; set; }
        public Guid ReservationId { get; set; }
        public MethodePaiement Methode { get; set; }
    }

    public class UpdatePaiementDto
    {
        public decimal Montant { get; set; }
        public PaiementStatut Statut { get; set; }
        public MethodePaiement Methode { get; set; }
    }
} 