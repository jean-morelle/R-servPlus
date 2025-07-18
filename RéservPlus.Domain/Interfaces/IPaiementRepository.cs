using RéservPlus.Domain.Models;

namespace RéservPlus.Domain.Interfaces
{
    public interface IPaiementRepository
    {
        Task<IEnumerable<Paiement>> GetAllAsync();
        Task<Paiement?> GetByIdAsync(Guid id);
        Task<IEnumerable<Paiement>> GetByReservationIdAsync(Guid reservationId);
        Task<IEnumerable<Paiement>> GetByStatutAsync(PaiementStatut statut);
        Task<IEnumerable<Paiement>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<Paiement> AddAsync(Paiement paiement);
        Task<Paiement> UpdateAsync(Paiement paiement);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
    }
} 