using Microsoft.EntityFrameworkCore;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;
using RéservPlus.Infrastructure.Data;

namespace RéservPlus.Infrastructure.Repositories
{
    public class PaiementRepository : IPaiementRepository
    {
        private readonly ApplicationDbContext _context;

        public PaiementRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Paiement>> GetAllAsync()
        {
            return await _context.Paiements
                .Include(p => p.Reservation)
                .ToListAsync();
        }

        public async Task<Paiement?> GetByIdAsync(Guid id)
        {
            return await _context.Paiements
                .Include(p => p.Reservation)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Paiement>> GetByReservationIdAsync(Guid reservationId)
        {
            return await _context.Paiements
                .Include(p => p.Reservation)
                .Where(p => p.ReservationId == reservationId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Paiement>> GetByStatutAsync(PaiementStatut statut)
        {
            return await _context.Paiements
                .Include(p => p.Reservation)
                .Where(p => p.Statut == statut)
                .ToListAsync();
        }

        public async Task<IEnumerable<Paiement>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Paiements
                .Include(p => p.Reservation)
                .Where(p => p.Date >= startDate && p.Date <= endDate)
                .ToListAsync();
        }

        public async Task<Paiement> AddAsync(Paiement paiement)
        {
            _context.Paiements.Add(paiement);
            await _context.SaveChangesAsync();
            return paiement;
        }

        public async Task<Paiement> UpdateAsync(Paiement paiement)
        {
            _context.Paiements.Update(paiement);
            await _context.SaveChangesAsync();
            return paiement;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var paiement = await _context.Paiements.FindAsync(id);
            if (paiement == null)
                return false;

            _context.Paiements.Remove(paiement);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Paiements.AnyAsync(p => p.Id == id);
        }
    }
} 