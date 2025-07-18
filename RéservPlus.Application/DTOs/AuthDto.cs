using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RéservPlus.Application.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        [JsonPropertyName("motDePasse")]
        public string MotDePasse { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        public string Nom { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        public string Prenom { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string MotDePasse { get; set; } = string.Empty;

        [Required]
        [Compare("MotDePasse")]
        public string ConfirmerMotDePasse { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string? Message { get; set; }
        public UserDto? User { get; set; }
    }

    public class RefreshTokenDto
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class ChangePasswordDto
    {
        [Required]
        public string AncienMotDePasse { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NouveauMotDePasse { get; set; } = string.Empty;

        [Required]
        [Compare("NouveauMotDePasse")]
        public string ConfirmerNouveauMotDePasse { get; set; } = string.Empty;
    }

    public class ExternalAuthDto
    {
        [Required]
        public string Provider { get; set; } = string.Empty; // "Google" ou "Facebook"

        [Required]
        public string AccessToken { get; set; } = string.Empty;
    }

    public class ExternalUserInfoDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
    }
} 