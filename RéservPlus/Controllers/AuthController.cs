using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Interfaces;
using RéservPlus.Application.Services;
using RéservPlus.Domain.Interfaces;
using System.Security.Claims;

namespace RéservPlus.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IExternalAuthService _externalAuthService;
        private readonly IUserRepository _userRepository;

        public AuthController(IAuthService authService, IExternalAuthService externalAuthService, IUserRepository userRepository)
        {
            _authService = authService;
            _externalAuthService = externalAuthService;
            _userRepository = userRepository;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(loginDto);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }



        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponseDto>> RefreshToken(RefreshTokenDto refreshTokenDto)
        {
            var result = await _authService.RefreshTokenAsync(refreshTokenDto.RefreshToken);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> Logout([FromBody] RefreshTokenDto refreshTokenDto)
        {
            var result = await _authService.LogoutAsync(refreshTokenDto.RefreshToken);
            
            if (!result)
                return BadRequest("Refresh token invalide");

            return Ok(new { message = "Déconnexion réussie" });
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized();

            var result = await _authService.ChangePasswordAsync(userId, changePasswordDto);
            
            if (!result)
                return BadRequest("Ancien mot de passe incorrect");

            return Ok(new { message = "Mot de passe modifié avec succès" });
        }

        [HttpGet("validate")]
        [Authorize]
        public async Task<ActionResult> ValidateToken()
        {
            var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (string.IsNullOrEmpty(token))
                return Unauthorized();

            var isValid = await _authService.ValidateTokenAsync(token);
            
            if (!isValid)
                return Unauthorized();

            return Ok(new { message = "Token valide" });
        }

        [HttpGet("profile")]
        [Authorize]
        public ActionResult GetProfile()
        {
            var claims = new
            {
                Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                Email = User.FindFirst(ClaimTypes.Email)?.Value,
                Name = User.FindFirst(ClaimTypes.Name)?.Value,
                FirstName = User.FindFirst(ClaimTypes.GivenName)?.Value,
                LastName = User.FindFirst(ClaimTypes.Surname)?.Value
            };

            return Ok(claims);
        }

        [HttpPost("google")]
        public async Task<ActionResult<AuthResponseDto>> GoogleAuth(ExternalAuthDto externalAuthDto)
        {
            try
            {
                if (externalAuthDto.Provider.ToLower() != "google")
                    return BadRequest("Provider doit être 'Google'");

                var result = await _externalAuthService.AuthenticateWithGoogleAsync(externalAuthDto.AccessToken);
                
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = $"Erreur lors de l'authentification Google: {ex.Message}"
                });
            }
        }

        [HttpPost("facebook")]
        public async Task<ActionResult<AuthResponseDto>> FacebookAuth(ExternalAuthDto externalAuthDto)
        {
            try
            {
                if (externalAuthDto.Provider.ToLower() != "facebook")
                    return BadRequest("Provider doit être 'Facebook'");

                var result = await _externalAuthService.AuthenticateWithFacebookAsync(externalAuthDto.AccessToken);
                
                if (!result.Success)
                    return BadRequest(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new AuthResponseDto
                {
                    Success = false,
                    Message = $"Erreur lors de l'authentification Facebook: {ex.Message}"
                });
            }
        }

        [HttpGet("google/userinfo")]
        public async Task<ActionResult<ExternalUserInfoDto>> GetGoogleUserInfo([FromQuery] string accessToken)
        {
            try
            {
                var userInfo = await _externalAuthService.GetGoogleUserInfoAsync(accessToken);
                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Erreur lors de la récupération des informations Google: {ex.Message}" });
            }
        }

        [HttpGet("facebook/userinfo")]
        public async Task<ActionResult<ExternalUserInfoDto>> GetFacebookUserInfo([FromQuery] string accessToken)
        {
            try
            {
                var userInfo = await _externalAuthService.GetFacebookUserInfoAsync(accessToken);
                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Erreur lors de la récupération des informations Facebook: {ex.Message}" });
            }
        }

        [HttpPost("debug-users")]
        public async Task<IActionResult> DebugUsers()
        {
            try
            {
                var users = await _userRepository.GetAllAsync();
                var debugInfo = users.Select(u => new
                {
                    Id = u.Id,
                    Email = u.Email,
                    Nom = u.Nom,
                    Prenom = u.Prenom,
                    MotDePasseLength = u.MotDePasse?.Length ?? 0,
                    MotDePasseStart = u.MotDePasse?.Substring(0, Math.Min(10, u.MotDePasse.Length)) ?? "null",
                    IsBCrypt = u.MotDePasse?.StartsWith("$2a$") == true || u.MotDePasse?.StartsWith("$2b$") == true,
                    DateInscription = u.DateInscription
                }).ToList();

                return Ok(new { 
                    Success = true, 
                    Users = debugInfo,
                    TotalUsers = debugInfo.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Success = false, Message = ex.Message });
            }
        }


    }
} 