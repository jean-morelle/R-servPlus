using Microsoft.EntityFrameworkCore;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;
using RéservPlus.Infrastructure.Data;

namespace RéservPlus.Infrastructure.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly ApplicationDbContext _context;

        public ReservationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Reservation>> GetAllAsync()
        {
            return await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Service)
                .Include(r => r.Paiement)
                .ToListAsync();
        }

        public async Task<Reservation?> GetByIdAsync(Guid id)
        {
            return await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Service)
                .Include(r => r.Paiement)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Reservation> AddAsync(Reservation reservation)
        {
            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();
            return reservation;
        }

        public async Task<Reservation> UpdateAsync(Reservation reservation)
        {
            _context.Entry(reservation).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return reservation;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
                return false;

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Reservations.AnyAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Reservation>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Service)
                .Include(r => r.Paiement)
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetByServiceIdAsync(Guid serviceId)
        {
            return await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Service)
                .Include(r => r.Paiement)
                .Where(r => r.ServiceId == serviceId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetByDateAsync(DateTime date)
        {
            return await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Service)
                .Include(r => r.Paiement)
                .Where(r => r.DateReservation.Date == date.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetByStatutAsync(ReservationStatut statut)
        {
            return await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Service)
                .Include(r => r.Paiement)
                .Where(r => r.Statut == statut)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> GetByDateRangeAsync(DateTime dateDebut, DateTime dateFin)
        {
            return await _context.Reservations
                .Include(r => r.User)
                .Include(r => r.Service)
                .Include(r => r.Paiement)
                .Where(r => r.DateReservation.Date >= dateDebut.Date && r.DateReservation.Date <= dateFin.Date)
                .ToListAsync();
        }

        public async Task<bool> CheckDisponibiliteAsync(Guid serviceId, DateTime date, TimeSpan heureDebut, TimeSpan heureFin, Guid? excludeReservationId = null)
        {
            var query = _context.Reservations
                .Where(r => r.ServiceId == serviceId && 
                           r.DateReservation.Date == date.Date &&
                           r.Statut != ReservationStatut.Annulee &&
                           r.Statut != ReservationStatut.Refusee);

            if (excludeReservationId.HasValue)
            {
                query = query.Where(r => r.Id != excludeReservationId.Value);
            }

            var conflits = await query
                .Where(r => (r.HeureDebut < heureFin && r.HeureFin > heureDebut))
                .AnyAsync();

            return !conflits;
        }
    }
} 