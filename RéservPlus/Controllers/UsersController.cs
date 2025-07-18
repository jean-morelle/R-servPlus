using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Services;

namespace RéservPlus.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page < 1 || pageSize < 1 || pageSize > 100)
                return BadRequest("Page et pageSize doivent être positifs et pageSize ne peut pas dépasser 100");

            var users = await _userService.GetAllAsync(page, pageSize);
            var totalCount = await _userService.GetCountAsync();
            
            Response.Headers.Add("X-Total-Count", totalCount.ToString());
            Response.Headers.Add("X-Page", page.ToString());
            Response.Headers.Add("X-PageSize", pageSize.ToString());
            
            return Ok(users);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<UserDto>> GetById(Guid id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpGet("email/{email}")]
        public async Task<ActionResult<UserDto>> GetByEmail(string email)
        {
            var user = await _userService.GetByEmailAsync(email);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetByNom([FromQuery] string nom)
        {
            if (string.IsNullOrWhiteSpace(nom))
                return BadRequest("Le nom est requis");

            var users = await _userService.GetByNomAsync(nom);
            return Ok(users);
        }

        [HttpGet("date/{date:datetime}")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetByDateInscription(DateTime date)
        {
            var users = await _userService.GetByDateInscriptionAsync(date);
            return Ok(users);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> Create(CreateUserDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdUser = await _userService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = createdUser.Id }, createdUser);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<UserDto>> Update(Guid id, UpdateUserDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedUser = await _userService.UpdateAsync(id, updateDto);
                return Ok(updatedUser);
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _userService.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpGet("check-email")]
        public async Task<ActionResult<bool>> CheckEmailExists([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("L'email est requis");

            var exists = await _userService.EmailExistsAsync(email);
            return Ok(exists);
        }
    }
} 