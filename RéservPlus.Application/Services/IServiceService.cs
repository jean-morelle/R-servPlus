using RéservPlus.Application.DTOs;

namespace RéservPlus.Application.Services
{
    public interface IServiceService
    {
        Task<IEnumerable<ServiceDto>> GetAllServicesAsync();
        Task<ServiceDto?> GetServiceByIdAsync(Guid id);
        Task<IEnumerable<ServiceDto>> GetServicesByPrestataireAsync(Guid prestataireId);
        Task<IEnumerable<ServiceDto>> GetServicesByTypeAsync(string type);
        Task<ServiceDto> CreateServiceAsync(CreateServiceDto createDto);
        Task UpdateServiceAsync(Guid id, UpdateServiceDto updateDto);
        Task DeleteServiceAsync(Guid id);
        Task<IEnumerable<ServiceDto>> SearchServicesAsync(string searchTerm);
    }
} 