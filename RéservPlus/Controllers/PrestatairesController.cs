using Microsoft.AspNetCore.Mvc;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Services;

namespace RéservPlus.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrestatairesController : ControllerBase
    {
        private readonly IPrestataireService _prestataireService;

        public PrestatairesController(IPrestataireService prestataireService)
        {
            _prestataireService = prestataireService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrestataireDto>>> GetAll()
        {
            var prestataires = await _prestataireService.GetAllAsync();
            return Ok(prestataires);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PrestataireDto>> GetById(Guid id)
        {
            var prestataire = await _prestataireService.GetByIdAsync(id);
            if (prestataire == null)
                return NotFound();

            return Ok(prestataire);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PrestataireDto>>> GetByNomCommercial([FromQuery] string nomCommercial)
        {
            if (string.IsNullOrWhiteSpace(nomCommercial))
                return BadRequest("Le nom commercial est requis");

            var prestataires = await _prestataireService.GetByNomCommercialAsync(nomCommercial);
            return Ok(prestataires);
        }

        [HttpPost]
        public async Task<ActionResult<PrestataireDto>> Create(CreatePrestataireDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdPrestataire = await _prestataireService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = createdPrestataire.Id }, createdPrestataire);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<PrestataireDto>> Update(Guid id, UpdatePrestataireDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedPrestataire = await _prestataireService.UpdateAsync(id, updateDto);
                return Ok(updatedPrestataire);
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _prestataireService.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
} 