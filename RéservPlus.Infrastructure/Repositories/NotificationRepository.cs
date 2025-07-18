using Microsoft.EntityFrameworkCore;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;
using RéservPlus.Infrastructure.Data;

namespace RéservPlus.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetAllAsync()
        {
            return await _context.Notifications
                .Include(n => n.User)
                .Include(n => n.Reservation)
                .Include(n => n.Paiement)
                .OrderByDescending(n => n.DateCreation)
                .ToListAsync();
        }

        public async Task<Notification?> GetByIdAsync(int id)
        {
            return await _context.Notifications
                .Include(n => n.User)
                .Include(n => n.Reservation)
                .Include(n => n.Paiement)
                .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId)
        {
            return await _context.Notifications
                .Include(n => n.User)
                .Include(n => n.Reservation)
                .Include(n => n.Paiement)
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.DateCreation)
                .ToListAsync();
        }

        public async Task<IEnumerable<Notification>> GetUnreadByUserIdAsync(Guid userId)
        {
            return await _context.Notifications
                .Include(n => n.User)
                .Include(n => n.Reservation)
                .Include(n => n.Paiement)
                .Where(n => n.UserId == userId && !n.Lu)
                .OrderByDescending(n => n.DateCreation)
                .ToListAsync();
        }

        public async Task<int> GetUnreadCountByUserIdAsync(Guid userId)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.Lu);
        }

        public async Task<Notification> CreateAsync(Notification notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task<Notification> UpdateAsync(Notification notification)
        {
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task DeleteAsync(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                _context.Notifications.Remove(notification);
                await _context.SaveChangesAsync();
            }
        }

        public async Task MarkAsReadAsync(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                notification.Lu = true;
                notification.DateLecture = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task MarkAllAsReadByUserIdAsync(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.Lu)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.Lu = true;
                notification.DateLecture = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }
    }
} 