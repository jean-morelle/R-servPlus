using Microsoft.EntityFrameworkCore;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;
using RéservPlus.Infrastructure.Data;

namespace RéservPlus.Infrastructure.Repositories
{
    public class PrestataireRepository : IPrestataireRepository
    {
        private readonly ApplicationDbContext _context;

        public PrestataireRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Prestataire>> GetAllAsync()
        {
            return await _context.Prestataires
                .Include(p => p.Services)
                .ToListAsync();
        }

        public async Task<Prestataire?> GetByIdAsync(Guid id)
        {
            return await _context.Prestataires
                .Include(p => p.Services)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Prestataire> AddAsync(Prestataire prestataire)
        {
            _context.Prestataires.Add(prestataire);
            await _context.SaveChangesAsync();
            return prestataire;
        }

        public async Task<Prestataire> UpdateAsync(Prestataire prestataire)
        {
            _context.Entry(prestataire).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return prestataire;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var prestataire = await _context.Prestataires.FindAsync(id);
            if (prestataire == null)
                return false;

            _context.Prestataires.Remove(prestataire);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Prestataires.AnyAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Prestataire>> GetByNomCommercialAsync(string nomCommercial)
        {
            return await _context.Prestataires
                .Include(p => p.Services)
                .Where(p => p.NomCommercial.Contains(nomCommercial))
                .ToListAsync();
        }
    }
} 