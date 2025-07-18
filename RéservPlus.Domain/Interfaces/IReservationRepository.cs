using RéservPlus.Domain.Models;

namespace RéservPlus.Domain.Interfaces
{
    public interface IReservationRepository
    {
        Task<IEnumerable<Reservation>> GetAllAsync();
        Task<Reservation?> GetByIdAsync(Guid id);
        Task<Reservation> AddAsync(Reservation reservation);
        Task<Reservation> UpdateAsync(Reservation reservation);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        
        // Méthodes spécifiques aux réservations
        Task<IEnumerable<Reservation>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<Reservation>> GetByServiceIdAsync(Guid serviceId);
        Task<IEnumerable<Reservation>> GetByDateAsync(DateTime date);
        Task<IEnumerable<Reservation>> GetByStatutAsync(ReservationStatut statut);
        Task<IEnumerable<Reservation>> GetByDateRangeAsync(DateTime dateDebut, DateTime dateFin);
        Task<bool> CheckDisponibiliteAsync(Guid serviceId, DateTime date, TimeSpan heureDebut, TimeSpan heureFin, Guid? excludeReservationId = null);
    }
} 