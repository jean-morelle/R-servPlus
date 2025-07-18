using System.Net.Http.Json;
using System.Text.Json;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Interfaces;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Services
{
    public interface IExternalAuthService
    {
        Task<AuthResponseDto> AuthenticateWithGoogleAsync(string accessToken);
        Task<AuthResponseDto> AuthenticateWithFacebookAsync(string accessToken);
        Task<ExternalUserInfoDto> GetGoogleUserInfoAsync(string accessToken);
        Task<ExternalUserInfoDto> GetFacebookUserInfoAsync(string accessToken);
    }

    public class ExternalAuthService : IExternalAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;
        private readonly HttpClient _httpClient;

        public ExternalAuthService(IUserRepository userRepository, IAuthService authService, HttpClient httpClient)
        {
            _userRepository = userRepository;
            _authService = authService;
            _httpClient = httpClient;
        }

        public async Task<AuthResponseDto> AuthenticateWithGoogleAsync(string accessToken)
        {
            var userInfo = await GetGoogleUserInfoAsync(accessToken);
            return await ProcessExternalUserAsync(userInfo);
        }

        public async Task<AuthResponseDto> AuthenticateWithFacebookAsync(string accessToken)
        {
            var userInfo = await GetFacebookUserInfoAsync(accessToken);
            return await ProcessExternalUserAsync(userInfo);
        }

        public async Task<ExternalUserInfoDto> GetGoogleUserInfoAsync(string accessToken)
        {
            var response = await _httpClient.GetAsync($"https://www.googleapis.com/oauth2/v2/userinfo?access_token={accessToken}");
            
            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException("Impossible de récupérer les informations utilisateur Google");

            var userInfo = await response.Content.ReadFromJsonAsync<GoogleUserInfo>();
            
            return new ExternalUserInfoDto
            {
                Id = userInfo?.Id ?? "",
                Email = userInfo?.Email ?? "",
                Name = userInfo?.Name ?? "",
                FirstName = userInfo?.GivenName ?? "",
                LastName = userInfo?.FamilyName ?? "",
                Picture = userInfo?.Picture ?? "",
                Provider = "Google"
            };
        }

        public async Task<ExternalUserInfoDto> GetFacebookUserInfoAsync(string accessToken)
        {
            var response = await _httpClient.GetAsync($"https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture&access_token={accessToken}");
            
            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException("Impossible de récupérer les informations utilisateur Facebook");

            var userInfo = await response.Content.ReadFromJsonAsync<FacebookUserInfo>();
            
            return new ExternalUserInfoDto
            {
                Id = userInfo?.Id ?? "",
                Email = userInfo?.Email ?? "",
                Name = userInfo?.Name ?? "",
                FirstName = userInfo?.FirstName ?? "",
                LastName = userInfo?.LastName ?? "",
                Picture = userInfo?.Picture?.Data?.Url ?? "",
                Provider = "Facebook"
            };
        }

        private async Task<AuthResponseDto> ProcessExternalUserAsync(ExternalUserInfoDto externalUser)
        {
            // Vérifier si l'utilisateur existe déjà
            var existingUser = await _userRepository.GetByEmailAsync(externalUser.Email);
            
            if (existingUser != null)
            {
                // Utilisateur existe, générer un token JWT
                var userDto = new UserDto
                {
                    Id = existingUser.Id,
                    Email = existingUser.Email,
                    Nom = existingUser.Nom,
                    Prenom = existingUser.Prenom,
                    DateInscription = existingUser.DateInscription
                };

                var token = _authService.GenerateJwtToken(userDto);
                var refreshToken = _authService.GenerateRefreshToken();
                var expiresAt = DateTime.UtcNow.AddHours(1);

                return new AuthResponseDto
                {
                    Success = true,
                    Token = token,
                    RefreshToken = refreshToken,
                    ExpiresAt = expiresAt,
                    User = userDto,
                    Message = $"Connexion réussie avec {externalUser.Provider}"
                };
            }
            else
            {
                // Créer un nouvel utilisateur
                var newUser = new User
                {
                    Email = externalUser.Email,
                    Nom = externalUser.LastName,
                    Prenom = externalUser.FirstName,
                    MotDePasse = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Mot de passe aléatoire
                    DateInscription = DateTime.UtcNow
                };

                var createdUser = await _userRepository.AddAsync(newUser);
                var userDto = new UserDto
                {
                    Id = createdUser.Id,
                    Email = createdUser.Email,
                    Nom = createdUser.Nom,
                    Prenom = createdUser.Prenom,
                    DateInscription = createdUser.DateInscription
                };

                var token = _authService.GenerateJwtToken(userDto);
                var refreshToken = _authService.GenerateRefreshToken();
                var expiresAt = DateTime.UtcNow.AddHours(1);

                return new AuthResponseDto
                {
                    Success = true,
                    Token = token,
                    RefreshToken = refreshToken,
                    ExpiresAt = expiresAt,
                    User = userDto,
                    Message = $"Inscription réussie avec {externalUser.Provider}"
                };
            }
        }

        // Classes pour désérialiser les réponses des APIs
        private class GoogleUserInfo
        {
            public string Id { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public string GivenName { get; set; } = string.Empty;
            public string FamilyName { get; set; } = string.Empty;
            public string Picture { get; set; } = string.Empty;
        }

        private class FacebookUserInfo
        {
            public string Id { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public string FirstName { get; set; } = string.Empty;
            public string LastName { get; set; } = string.Empty;
            public FacebookPicture Picture { get; set; } = new();
        }

        private class FacebookPicture
        {
            public FacebookPictureData Data { get; set; } = new();
        }

        private class FacebookPictureData
        {
            public string Url { get; set; } = string.Empty;
        }
    }
} 