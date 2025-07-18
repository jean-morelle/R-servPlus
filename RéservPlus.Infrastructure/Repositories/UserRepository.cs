using Microsoft.EntityFrameworkCore;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;
using RéservPlus.Infrastructure.Data;

namespace RéservPlus.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users
                .Include(u => u.Reservations)
                .AsNoTracking() // Better performance for read-only operations
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetAllAsync(int page, int pageSize)
        {
            return await _context.Users
                .Include(u => u.Reservations)
                .AsNoTracking()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetCountAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.Reservations)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User> AddAsync(User user)
        {
            // Hash du mot de passe avec BCrypt avant de sauvegarder
            user.MotDePasse = BCrypt.Net.BCrypt.HashPassword(user.MotDePasse);
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            // Si le mot de passe a changé, le hasher avec BCrypt
            var existingUser = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == user.Id);
            if (existingUser != null && existingUser.MotDePasse != user.MotDePasse)
            {
                user.MotDePasse = BCrypt.Net.BCrypt.HashPassword(user.MotDePasse);
            }

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Users.AnyAsync(u => u.Id == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Reservations)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<User>> GetByNomAsync(string nom)
        {
            return await _context.Users
                .Include(u => u.Reservations)
                .Where(u => u.Nom.Contains(nom))
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetByDateInscriptionAsync(DateTime date)
        {
            return await _context.Users
                .Include(u => u.Reservations)
                .Where(u => u.DateInscription.Date == date.Date)
                .ToListAsync();
        }

        public async Task<User?> AuthenticateAsync(string email, string motDePasse)
        {
            var user = await _context.Users
                .Include(u => u.Reservations)
                .FirstOrDefaultAsync(u => u.Email == email);
                
            if (user == null)
                return null;
                
            // Vérifier le mot de passe avec BCrypt
            if (BCrypt.Net.BCrypt.Verify(motDePasse, user.MotDePasse))
                return user;
                
            return null;
        }
    }
} 