using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Services
{
    public interface IReservationService
    {
        Task<IEnumerable<ReservationDto>> GetAllAsync();
        Task<ReservationDto?> GetByIdAsync(Guid id);
        Task<ReservationDto> CreateAsync(CreateReservationDto createDto);
        Task<ReservationDto> UpdateAsync(Guid id, UpdateReservationDto updateDto);
        Task<bool> DeleteAsync(Guid id);
        
        // Méthodes spécifiques aux réservations
        Task<IEnumerable<ReservationDto>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<ReservationDto>> GetByServiceIdAsync(Guid serviceId);
        Task<IEnumerable<ReservationDto>> GetByDateAsync(DateTime date);
        Task<IEnumerable<ReservationDto>> GetByStatutAsync(ReservationStatut statut);
        Task<IEnumerable<ReservationDto>> GetByDateRangeAsync(DateTime dateDebut, DateTime dateFin);
        Task<bool> CheckDisponibiliteAsync(Guid serviceId, DateTime date, TimeSpan heureDebut, TimeSpan heureFin, Guid? excludeReservationId = null);
        Task<ReservationDto> UpdateStatutAsync(Guid id, ReservationStatut statut);
    }
} 