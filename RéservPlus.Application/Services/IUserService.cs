using RéservPlus.Application.DTOs;

namespace RéservPlus.Application.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<IEnumerable<UserDto>> GetAllAsync(int page, int pageSize);
        Task<int> GetCountAsync();
        Task<UserDto?> GetByIdAsync(Guid id);
        Task<UserDto> CreateAsync(CreateUserDto createDto);
        Task<UserDto> UpdateAsync(Guid id, UpdateUserDto updateDto);
        Task<bool> DeleteAsync(Guid id);
        
        // Méthodes spécifiques aux utilisateurs
        Task<UserDto?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<IEnumerable<UserDto>> GetByNomAsync(string nom);
        Task<IEnumerable<UserDto>> GetByDateInscriptionAsync(DateTime date);
        Task<UserDto?> AuthenticateAsync(string email, string motDePasse);
        Task<bool> ChangePasswordAsync(Guid id, string currentPassword, string newPassword);
    }
} 