using Microsoft.AspNetCore.Mvc;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Services;
using RéservPlus.Domain.Models;

namespace RéservPlus.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationsController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetAll()
        {
            var reservations = await _reservationService.GetAllAsync();
            return Ok(reservations);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ReservationDto>> GetById(Guid id)
        {
            var reservation = await _reservationService.GetByIdAsync(id);
            if (reservation == null)
                return NotFound();

            return Ok(reservation);
        }

        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetByUserId(Guid userId)
        {
            var reservations = await _reservationService.GetByUserIdAsync(userId);
            return Ok(reservations);
        }

        [HttpGet("service/{serviceId:guid}")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetByServiceId(Guid serviceId)
        {
            var reservations = await _reservationService.GetByServiceIdAsync(serviceId);
            return Ok(reservations);
        }

        [HttpGet("date/{date:datetime}")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetByDate(DateTime date)
        {
            var reservations = await _reservationService.GetByDateAsync(date);
            return Ok(reservations);
        }

        [HttpGet("statut/{statut}")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetByStatut(ReservationStatut statut)
        {
            var reservations = await _reservationService.GetByStatutAsync(statut);
            return Ok(reservations);
        }

        [HttpGet("daterange")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetByDateRange(
            [FromQuery] DateTime dateDebut, 
            [FromQuery] DateTime dateFin)
        {
            var reservations = await _reservationService.GetByDateRangeAsync(dateDebut, dateFin);
            return Ok(reservations);
        }

        [HttpGet("disponibilite")]
        public async Task<ActionResult<bool>> CheckDisponibilite(
            [FromQuery] Guid serviceId,
            [FromQuery] DateTime date,
            [FromQuery] TimeSpan heureDebut,
            [FromQuery] TimeSpan heureFin,
            [FromQuery] Guid? excludeReservationId = null)
        {
            var isAvailable = await _reservationService.CheckDisponibiliteAsync(
                serviceId, date, heureDebut, heureFin, excludeReservationId);
            return Ok(isAvailable);
        }

        [HttpPost]
        public async Task<ActionResult<ReservationDto>> Create(CreateReservationDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdReservation = await _reservationService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = createdReservation.Id }, createdReservation);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ReservationDto>> Update(Guid id, UpdateReservationDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedReservation = await _reservationService.UpdateAsync(id, updateDto);
                return Ok(updatedReservation);
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

        [HttpPatch("{id:guid}/statut")]
        public async Task<ActionResult<ReservationDto>> UpdateStatut(Guid id, [FromBody] ReservationStatut statut)
        {
            try
            {
                var updatedReservation = await _reservationService.UpdateStatutAsync(id, statut);
                return Ok(updatedReservation);
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _reservationService.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
} 