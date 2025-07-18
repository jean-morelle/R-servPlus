using RéservPlus.Application.DTOs;

namespace RéservPlus.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
        Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto);
        Task<bool> LogoutAsync(string refreshToken);
        Task<bool> ValidateTokenAsync(string token);
        string GenerateJwtToken(UserDto user);
        string GenerateRefreshToken();
    }
} 