using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Services;
using RéservPlus.Domain.Interfaces;

namespace RéservPlus.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync(int page, int pageSize)
        {
            var users = await _userRepository.GetAllAsync(page, pageSize);
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<int> GetCountAsync()
        {
            return await _userRepository.GetCountAsync();
        }

        public async Task<UserDto?> GetByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateAsync(CreateUserDto createDto)
        {
            // Vérifier si l'email existe déjà
            if (await _userRepository.EmailExistsAsync(createDto.Email))
                throw new InvalidOperationException("Un utilisateur avec cet email existe déjà");

            var user = _mapper.Map<Domain.Models.User>(createDto);
            var createdUser = await _userRepository.AddAsync(user);
            return _mapper.Map<UserDto>(createdUser);
        }

        public async Task<UserDto> UpdateAsync(Guid id, UpdateUserDto updateDto)
        {
            var existingUser = await _userRepository.GetByIdAsync(id);
            if (existingUser == null)
                throw new ArgumentException("User not found", nameof(id));

            // Vérifier si l'email a changé et s'il existe déjà
            if (updateDto.Email != existingUser.Email && await _userRepository.EmailExistsAsync(updateDto.Email))
                throw new InvalidOperationException("Un utilisateur avec cet email existe déjà");

            _mapper.Map(updateDto, existingUser);
            var updatedUser = await _userRepository.UpdateAsync(existingUser);
            return _mapper.Map<UserDto>(updatedUser);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _userRepository.DeleteAsync(id);
        }

        public async Task<UserDto?> GetByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _userRepository.EmailExistsAsync(email);
        }

        public async Task<IEnumerable<UserDto>> GetByNomAsync(string nom)
        {
            var users = await _userRepository.GetByNomAsync(nom);
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<IEnumerable<UserDto>> GetByDateInscriptionAsync(DateTime date)
        {
            var users = await _userRepository.GetByDateInscriptionAsync(date);
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto?> AuthenticateAsync(string email, string motDePasse)
        {
            var user = await _userRepository.AuthenticateAsync(email, motDePasse);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> ChangePasswordAsync(Guid id, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return false;

            // Vérifier l'ancien mot de passe
            var authenticatedUser = await _userRepository.AuthenticateAsync(user.Email, currentPassword);
            if (authenticatedUser == null)
                return false;

            // Mettre à jour avec le nouveau mot de passe
            user.MotDePasse = newPassword;
            await _userRepository.UpdateAsync(user);
            return true;
        }
    }
} 