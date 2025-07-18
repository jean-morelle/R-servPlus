using RéservPlus.Domain.Models;

namespace RéservPlus.Domain.Interfaces
{
    public interface IDisponibiliteRepository
    {
        Task<IEnumerable<Disponibilite>> GetAllAsync();
        Task<Disponibilite?> GetByIdAsync(Guid id);
        Task<IEnumerable<Disponibilite>> GetByServiceIdAsync(Guid serviceId);
        Task<IEnumerable<Disponibilite>> GetByDateAsync(DateTime date);
        Task<IEnumerable<Disponibilite>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<Disponibilite>> GetAvailableByServiceIdAsync(Guid serviceId);
        Task<IEnumerable<Disponibilite>> GetAvailableByDateRangeAsync(Guid serviceId, DateTime startDate, DateTime endDate);
        Task<Disponibilite> AddAsync(Disponibilite disponibilite);
        Task<Disponibilite> UpdateAsync(Disponibilite disponibilite);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        Task<bool> IsTimeSlotAvailableAsync(Guid serviceId, DateTime date, TimeSpan heureDebut, TimeSpan heureFin);
    }
} 