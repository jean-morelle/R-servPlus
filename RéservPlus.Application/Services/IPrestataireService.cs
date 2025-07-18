using RéservPlus.Application.DTOs;

namespace RéservPlus.Application.Services
{
    public interface IPrestataireService
    {
        Task<IEnumerable<PrestataireDto>> GetAllAsync();
        Task<PrestataireDto?> GetByIdAsync(Guid id);
        Task<PrestataireDto> CreateAsync(CreatePrestataireDto createDto);
        Task<PrestataireDto> UpdateAsync(Guid id, UpdatePrestataireDto updateDto);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<PrestataireDto>> GetByNomCommercialAsync(string nomCommercial);
    }
} 