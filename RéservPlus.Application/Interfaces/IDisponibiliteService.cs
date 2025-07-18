using RéservPlus.Application.DTOs;

namespace RéservPlus.Application.Interfaces
{
    public interface IDisponibiliteService
    {
        Task<IEnumerable<DisponibiliteDto>> GetAllAsync();
        Task<DisponibiliteDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<DisponibiliteDto>> GetByServiceIdAsync(Guid serviceId);
        Task<IEnumerable<DisponibiliteDto>> GetByDateAsync(DateTime date);
        Task<IEnumerable<DisponibiliteDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<DisponibiliteDto>> GetAvailableByServiceIdAsync(Guid serviceId);
        Task<IEnumerable<DisponibiliteDto>> GetAvailableByDateRangeAsync(Guid serviceId, DateTime startDate, DateTime endDate);
        Task<DisponibiliteDto> CreateAsync(CreateDisponibiliteDto createDto);
        Task<DisponibiliteDto> UpdateAsync(Guid id, UpdateDisponibiliteDto updateDto);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> IsTimeSlotAvailableAsync(Guid serviceId, DateTime date, TimeSpan heureDebut, TimeSpan heureFin);
        Task<IEnumerable<DisponibiliteDto>> SearchAsync(DisponibiliteSearchDto searchDto);
        Task<DisponibiliteDto> MarkAsUnavailableAsync(Guid id);
        Task<DisponibiliteDto> MarkAsAvailableAsync(Guid id);
    }
} 