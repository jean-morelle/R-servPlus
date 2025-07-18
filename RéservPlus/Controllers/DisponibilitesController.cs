using Microsoft.AspNetCore.Mvc;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Interfaces;

namespace RéservPlus.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DisponibilitesController : ControllerBase
    {
        private readonly IDisponibiliteService _disponibiliteService;

        public DisponibilitesController(IDisponibiliteService disponibiliteService)
        {
            _disponibiliteService = disponibiliteService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DisponibiliteDto>>> GetAll()
        {
            var disponibilites = await _disponibiliteService.GetAllAsync();
            return Ok(disponibilites);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DisponibiliteDto>> GetById(Guid id)
        {
            var disponibilite = await _disponibiliteService.GetByIdAsync(id);
            if (disponibilite == null)
                return NotFound();

            return Ok(disponibilite);
        }

        [HttpGet("service/{serviceId}")]
        public async Task<ActionResult<IEnumerable<DisponibiliteDto>>> GetByServiceId(Guid serviceId)
        {
            var disponibilites = await _disponibiliteService.GetByServiceIdAsync(serviceId);
            return Ok(disponibilites);
        }

        [HttpGet("date/{date:datetime}")]
        public async Task<ActionResult<IEnumerable<DisponibiliteDto>>> GetByDate(DateTime date)
        {
            var disponibilites = await _disponibiliteService.GetByDateAsync(date);
            return Ok(disponibilites);
        }

        [HttpGet("daterange")]
        public async Task<ActionResult<IEnumerable<DisponibiliteDto>>> GetByDateRange(
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var disponibilites = await _disponibiliteService.GetByDateRangeAsync(startDate, endDate);
            return Ok(disponibilites);
        }

        [HttpGet("available/service/{serviceId}")]
        public async Task<ActionResult<IEnumerable<DisponibiliteDto>>> GetAvailableByServiceId(Guid serviceId)
        {
            var disponibilites = await _disponibiliteService.GetAvailableByServiceIdAsync(serviceId);
            return Ok(disponibilites);
        }

        [HttpGet("available/daterange")]
        public async Task<ActionResult<IEnumerable<DisponibiliteDto>>> GetAvailableByDateRange(
            [FromQuery] Guid serviceId,
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var disponibilites = await _disponibiliteService.GetAvailableByDateRangeAsync(serviceId, startDate, endDate);
            return Ok(disponibilites);
        }

        [HttpGet("check-availability")]
        public async Task<ActionResult<bool>> CheckTimeSlotAvailability(
            [FromQuery] Guid serviceId,
            [FromQuery] DateTime date,
            [FromQuery] TimeSpan heureDebut,
            [FromQuery] TimeSpan heureFin)
        {
            var isAvailable = await _disponibiliteService.IsTimeSlotAvailableAsync(serviceId, date, heureDebut, heureFin);
            return Ok(isAvailable);
        }

        [HttpPost("search")]
        public async Task<ActionResult<IEnumerable<DisponibiliteDto>>> Search(DisponibiliteSearchDto searchDto)
        {
            var disponibilites = await _disponibiliteService.SearchAsync(searchDto);
            return Ok(disponibilites);
        }

        [HttpPost]
        public async Task<ActionResult<DisponibiliteDto>> Create(CreateDisponibiliteDto createDto)
        {
            try
            {
                var disponibilite = await _disponibiliteService.CreateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = disponibilite.Id }, disponibilite);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DisponibiliteDto>> Update(Guid id, UpdateDisponibiliteDto updateDto)
        {
            try
            {
                var disponibilite = await _disponibiliteService.UpdateAsync(id, updateDto);
                return Ok(disponibilite);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var deleted = await _disponibiliteService.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/mark-unavailable")]
        public async Task<ActionResult<DisponibiliteDto>> MarkAsUnavailable(Guid id)
        {
            try
            {
                var disponibilite = await _disponibiliteService.MarkAsUnavailableAsync(id);
                return Ok(disponibilite);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("{id}/mark-available")]
        public async Task<ActionResult<DisponibiliteDto>> MarkAsAvailable(Guid id)
        {
            try
            {
                var disponibilite = await _disponibiliteService.MarkAsAvailableAsync(id);
                return Ok(disponibilite);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
} 