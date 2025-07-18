using RéservPlus.Domain.Models;

namespace RéservPlus.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<IEnumerable<User>> GetAllAsync(int page, int pageSize);
        Task<int> GetCountAsync();
        Task<User?> GetByIdAsync(Guid id);
        Task<User> AddAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
        
        // Méthodes spécifiques aux utilisateurs
        Task<User?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<IEnumerable<User>> GetByNomAsync(string nom);
        Task<IEnumerable<User>> GetByDateInscriptionAsync(DateTime date);
        Task<User?> AuthenticateAsync(string email, string motDePasse);
    }
} 