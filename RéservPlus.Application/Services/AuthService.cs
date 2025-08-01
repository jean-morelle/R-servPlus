using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Interfaces;
using RéservPlus.Domain.Interfaces;

namespace RéservPlus.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly Dictionary<string, string> _refreshTokens = new(); // En production, utiliser Redis ou DB

        public AuthService(IUserRepository userRepository, IMapper mapper, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            // Vérifier si l'utilisateur existe
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Email ou mot de passe incorrect"
                };
            }

            // Vérification mot de passe avec gestion des deux formats de hash
            bool motDePasseValide = false;
            
            // Vérifier si c'est un hash BCrypt (commence par $2a$ ou $2b$)
            if (user.MotDePasse.StartsWith("$2a$") || user.MotDePasse.StartsWith("$2b$"))
            {
                motDePasseValide = BCrypt.Net.BCrypt.Verify(loginDto.MotDePasse, user.MotDePasse);
            }
            else
            {
                // Ancien format SHA256 - vérifier et migrer automatiquement
                using (var sha256 = System.Security.Cryptography.SHA256.Create())
                {
                    var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDto.MotDePasse));
                    var hashedPassword = Convert.ToBase64String(hashedBytes);
                    
                    if (hashedPassword == user.MotDePasse)
                    {
                        // Mot de passe correct, migrer vers BCrypt
                        user.MotDePasse = BCrypt.Net.BCrypt.HashPassword(loginDto.MotDePasse);
                        await _userRepository.UpdateAsync(user);
                        motDePasseValide = true;
                    }
                }
            }
            
            if (!motDePasseValide)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Email ou mot de passe incorrect"
                };
            }

            // Mapping utilisateur
            var userDto = _mapper.Map<UserDto>(user);

            // Génération du token
            string token = GenerateJwtToken(userDto);
            if (string.IsNullOrEmpty(token))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Erreur lors de la génération du token"
                };
            }

            string refreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddHours(1);

            // Stocker refresh token
            if (!_refreshTokens.ContainsKey(refreshToken))
            {
                _refreshTokens.Add(refreshToken, user.Id.ToString());
            }

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt,
                User = userDto,
                Message = "Connexion réussie"
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            // Vérifier si l'email existe déjà
            var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Un utilisateur avec cet email existe déjà"
                };
            }

            // Créer le nouvel utilisateur
            var newUser = new Domain.Models.User
            {
                Email = registerDto.Email,
                Nom = registerDto.Nom,
                Prenom = registerDto.Prenom,
                MotDePasse = registerDto.MotDePasse, // Le repository s'occupera du hachage
                DateInscription = DateTime.UtcNow
            };

            var createdUser = await _userRepository.AddAsync(newUser);
            var userDto = _mapper.Map<UserDto>(createdUser);

            var token = GenerateJwtToken(userDto);
            var refreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddHours(1);

            // Stocker le refresh token
            _refreshTokens[refreshToken] = createdUser.Id.ToString();

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt,
                User = userDto,
                Message = "Inscription réussie"
            };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
        {
            if (!_refreshTokens.ContainsKey(refreshToken))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Refresh token invalide"
                };
            }

            var userId = _refreshTokens[refreshToken];
            if (!Guid.TryParse(userId, out var userGuid))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Refresh token invalide"
                };
            }

            var user = await _userRepository.GetByIdAsync(userGuid);
            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Utilisateur non trouvé"
                };
            }

            var userDto = _mapper.Map<UserDto>(user);
            var newToken = GenerateJwtToken(userDto);
            var newRefreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddHours(1);

            // Supprimer l'ancien refresh token et ajouter le nouveau
            _refreshTokens.Remove(refreshToken);
            _refreshTokens[newRefreshToken] = user.Id.ToString();

            return new AuthResponseDto
            {
                Success = true,
                Token = newToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = expiresAt,
                User = userDto,
                Message = "Token rafraîchi avec succès"
            };
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return false;

            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.AncienMotDePasse, user.MotDePasse))
                return false;

            user.MotDePasse = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NouveauMotDePasse);
            await _userRepository.UpdateAsync(user);

            // Invalider tous les refresh tokens de l'utilisateur
            var tokensToRemove = _refreshTokens.Where(kvp => kvp.Value == userId.ToString()).ToList();
            foreach (var token in tokensToRemove)
            {
                _refreshTokens.Remove(token.Key);
            }

            return true;
        }

        public Task<bool> LogoutAsync(string refreshToken)
        {
            if (_refreshTokens.ContainsKey(refreshToken))
            {
                _refreshTokens.Remove(refreshToken);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"));

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return Task.FromResult(true);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }

        public string GenerateJwtToken(UserDto user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured"));

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Name, $"{user.Prenom} {user.Nom}"),
                new(ClaimTypes.GivenName, user.Prenom),
                new(ClaimTypes.Surname, user.Nom),
                new(ClaimTypes.Role, user.Role ?? "User") // Ajouter le rôle
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
} 