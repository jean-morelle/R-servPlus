using RéservPlus.Domain.Models;

namespace RéservPlus.Domain.Interfaces
{
    public interface IServiceRepository : IRepertory<Service>
    {
        Task<IEnumerable<Service>> GetByPrestataireIdAsync(Guid prestataireId);
        Task<IEnumerable<Service>> GetByTypeAsync(string type);
        Task<IEnumerable<Service>> SearchByNameAsync(string searchTerm);
        Task<bool> ServiceExistsForPrestataireAsync(Guid prestataireId, string nom);
    }
} 