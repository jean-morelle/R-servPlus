using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Interfaces
{
    public interface IPaiementService
    {
        Task<IEnumerable<PaiementDto>> GetAllAsync();
        Task<PaiementDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<PaiementDto>> GetByReservationIdAsync(Guid reservationId);
        Task<IEnumerable<PaiementDto>> GetByStatutAsync(PaiementStatut statut);
        Task<IEnumerable<PaiementDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<PaiementDto> CreateAsync(CreatePaiementDto createDto);
        Task<PaiementDto> UpdateAsync(Guid id, UpdatePaiementDto updateDto);
        Task<bool> DeleteAsync(Guid id);
        Task<PaiementDto> ValiderPaiementAsync(Guid id);
        Task<PaiementDto> RefuserPaiementAsync(Guid id);
        Task<PaiementDto> RembourserPaiementAsync(Guid id);
    }
} 