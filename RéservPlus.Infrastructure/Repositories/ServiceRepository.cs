using Microsoft.EntityFrameworkCore;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;
using RéservPlus.Infrastructure.Data;

namespace RéservPlus.Infrastructure.Repositories
{
    public class ServiceRepository : GenericRepository<Service>, IServiceRepository
    {
        public ServiceRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Service>> GetByPrestataireIdAsync(Guid prestataireId)
        {
            return await _dbSet
                .Where(s => s.PrestataireId == prestataireId)
                .Include(s => s.Prestataire)
                .ToListAsync();
        }

        public async Task<IEnumerable<Service>> GetByTypeAsync(string type)
        {
            return await _dbSet
                .Where(s => s.Type == type)
                .Include(s => s.Prestataire)
                .ToListAsync();
        }

        public async Task<IEnumerable<Service>> SearchByNameAsync(string searchTerm)
        {
            return await _dbSet
                .Where(s => s.Nom.Contains(searchTerm))
                .Include(s => s.Prestataire)
                .ToListAsync();
        }

        public async Task<bool> ServiceExistsForPrestataireAsync(Guid prestataireId, string nom)
        {
            return await _dbSet.AnyAsync(s => s.PrestataireId == prestataireId && s.Nom == nom);
        }
    }
} 