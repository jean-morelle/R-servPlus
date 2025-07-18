using Microsoft.AspNetCore.Mvc;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Interfaces;
using RéservPlus.Domain.Models;

namespace RéservPlus.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaiementsController : ControllerBase
    {
        private readonly IPaiementService _paiementService;

        public PaiementsController(IPaiementService paiementService)
        {
            _paiementService = paiementService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaiementDto>>> GetAll()
        {
            var paiements = await _paiementService.GetAllAsync();
            return Ok(paiements);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaiementDto>> GetById(Guid id)
        {
            var paiement = await _paiementService.GetByIdAsync(id);
            if (paiement == null)
                return NotFound();

            return Ok(paiement);
        }

        [HttpGet("reservation/{reservationId}")]
        public async Task<ActionResult<IEnumerable<PaiementDto>>> GetByReservationId(Guid reservationId)
        {
            var paiements = await _paiementService.GetByReservationIdAsync(reservationId);
            return Ok(paiements);
        }

        [HttpGet("statut/{statut}")]
        public async Task<ActionResult<IEnumerable<PaiementDto>>> GetByStatut(PaiementStatut statut)
        {
            var paiements = await _paiementService.GetByStatutAsync(statut);
            return Ok(paiements);
        }

        [HttpGet("daterange")]
        public async Task<ActionResult<IEnumerable<PaiementDto>>> GetByDateRange(
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var paiements = await _paiementService.GetByDateRangeAsync(startDate, endDate);
            return Ok(paiements);
        }

        [HttpPost]
        public async Task<ActionResult<PaiementDto>> Create(CreatePaiementDto createDto)
        {
            try
            {
                var paiement = await _paiementService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = paiement.Id }, paiement);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PaiementDto>> Update(Guid id, UpdatePaiementDto updateDto)
        {
            try
            {
                var paiement = await _paiementService.UpdateAsync(id, updateDto);
                return Ok(paiement);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _paiementService.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/valider")]
        public async Task<ActionResult<PaiementDto>> ValiderPaiement(Guid id)
        {
            try
            {
                var paiement = await _paiementService.ValiderPaiementAsync(id);
                return Ok(paiement);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("{id}/refuser")]
        public async Task<ActionResult<PaiementDto>> RefuserPaiement(Guid id)
        {
            try
            {
                var paiement = await _paiementService.RefuserPaiementAsync(id);
                return Ok(paiement);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("{id}/rembourser")]
        public async Task<ActionResult<PaiementDto>> RembourserPaiement(Guid id)
        {
            try
            {
                var paiement = await _paiementService.RembourserPaiementAsync(id);
                return Ok(paiement);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
} 