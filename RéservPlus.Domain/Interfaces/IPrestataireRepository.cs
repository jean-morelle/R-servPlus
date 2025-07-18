using RéservPlus.Domain.Models;

namespace RéservPlus.Domain.Interfaces
{
    public interface IPrestataireRepository
    {
        Task<IEnumerable<Prestataire>> GetAllAsync();
        Task<Prestataire?> GetByIdAsync(Guid id);
        Task<Prestataire> AddAsync(Prestataire prestataire);
        Task<Prestataire> UpdateAsync(Prestataire prestataire);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        Task<IEnumerable<Prestataire>> GetByNomCommercialAsync(string nomCommercial);
    }
} 