using Microsoft.EntityFrameworkCore;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;
using RéservPlus.Infrastructure.Data;

namespace RéservPlus.Infrastructure.Repositories
{
    public class DisponibiliteRepository : IDisponibiliteRepository
    {
        private readonly ApplicationDbContext _context;

        public DisponibiliteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Disponibilite>> GetAllAsync()
        {
            return await _context.Disponibilites
                .Include(d => d.Service)
                .ToListAsync();
        }

        public async Task<Disponibilite?> GetByIdAsync(Guid id)
        {
            return await _context.Disponibilites
                .Include(d => d.Service)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<IEnumerable<Disponibilite>> GetByServiceIdAsync(Guid serviceId)
        {
            return await _context.Disponibilites
                .Include(d => d.Service)
                .Where(d => d.ServiceId == serviceId)
                .OrderBy(d => d.Date)
                .ThenBy(d => d.HeureDebut)
                .ToListAsync();
        }

        public async Task<IEnumerable<Disponibilite>> GetByDateAsync(DateTime date)
        {
            return await _context.Disponibilites
                .Include(d => d.Service)
                .Where(d => d.Date.Date == date.Date)
                .OrderBy(d => d.HeureDebut)
                .ToListAsync();
        }

        public async Task<IEnumerable<Disponibilite>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Disponibilites
                .Include(d => d.Service)
                .Where(d => d.Date >= startDate && d.Date <= endDate)
                .OrderBy(d => d.Date)
                .ThenBy(d => d.HeureDebut)
                .ToListAsync();
        }

        public async Task<IEnumerable<Disponibilite>> GetAvailableByServiceIdAsync(Guid serviceId)
        {
            return await _context.Disponibilites
                .Include(d => d.Service)
                .Where(d => d.ServiceId == serviceId && d.EstDisponible)
                .OrderBy(d => d.Date)
                .ThenBy(d => d.HeureDebut)
                .ToListAsync();
        }

        public async Task<IEnumerable<Disponibilite>> GetAvailableByDateRangeAsync(Guid serviceId, DateTime startDate, DateTime endDate)
        {
            return await _context.Disponibilites
                .Include(d => d.Service)
                .Where(d => d.ServiceId == serviceId && 
                           d.EstDisponible && 
                           d.Date >= startDate && 
                           d.Date <= endDate)
                .OrderBy(d => d.Date)
                .ThenBy(d => d.HeureDebut)
                .ToListAsync();
        }

        public async Task<Disponibilite> AddAsync(Disponibilite disponibilite)
        {
            _context.Disponibilites.Add(disponibilite);
            await _context.SaveChangesAsync();
            return disponibilite;
        }

        public async Task<Disponibilite> UpdateAsync(Disponibilite disponibilite)
        {
            _context.Disponibilites.Update(disponibilite);
            await _context.SaveChangesAsync();
            return disponibilite;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var disponibilite = await _context.Disponibilites.FindAsync(id);
            if (disponibilite == null)
                return false;

            _context.Disponibilites.Remove(disponibilite);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Disponibilites.AnyAsync(d => d.Id == id);
        }

        public async Task<bool> IsTimeSlotAvailableAsync(Guid serviceId, DateTime date, TimeSpan heureDebut, TimeSpan heureFin)
        {
            // Vérifier s'il y a des conflits avec les créneaux existants
            var conflictingDisponibilites = await _context.Disponibilites
                .Where(d => d.ServiceId == serviceId && 
                           d.Date.Date == date.Date &&
                           d.EstDisponible &&
                           ((d.HeureDebut < heureFin && d.HeureFin > heureDebut) ||
                            (heureDebut < d.HeureFin && heureFin > d.HeureDebut)))
                .AnyAsync();

            return !conflictingDisponibilites;
        }
    }
} 