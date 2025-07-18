using Microsoft.AspNetCore.Mvc;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Services;

namespace RéservPlus.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        // GET: api/services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetAllServices()
        {
            try
            {
                var services = await _serviceService.GetAllServicesAsync();
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la récupération des services", error = ex.Message });
            }
        }

        // GET: api/services/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDto>> GetServiceById(Guid id)
        {
            try
            {
                var service = await _serviceService.GetServiceByIdAsync(id);
                if (service == null)
                {
                    return NotFound(new { message = "Service non trouvé" });
                }
                return Ok(service);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la récupération du service", error = ex.Message });
            }
        }

        // GET: api/services/prestataire/{prestataireId}
        [HttpGet("prestataire/{prestataireId}")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServicesByPrestataire(Guid prestataireId)
        {
            try
            {
                var services = await _serviceService.GetServicesByPrestataireAsync(prestataireId);
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la récupération des services du prestataire", error = ex.Message });
            }
        }

        // GET: api/services/type/{type}
        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServicesByType(string type)
        {
            try
            {
                var services = await _serviceService.GetServicesByTypeAsync(type);
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la récupération des services par type", error = ex.Message });
            }
        }

        // POST: api/services
        [HttpPost]
        public async Task<ActionResult<ServiceDto>> CreateService([FromBody] CreateServiceDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var service = await _serviceService.CreateServiceAsync(createDto);
                return CreatedAtAction(nameof(GetServiceById), new { id = service.Id }, service);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la création du service", error = ex.Message });
            }
        }

        // PUT: api/services/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(Guid id, [FromBody] UpdateServiceDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _serviceService.UpdateServiceAsync(id, updateDto);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la mise à jour du service", error = ex.Message });
            }
        }

        // DELETE: api/services/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(Guid id)
        {
            try
            {
                await _serviceService.DeleteServiceAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la suppression du service", error = ex.Message });
            }
        }

        // GET: api/services/search?term=nom
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> SearchServices([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                {
                    return BadRequest(new { message = "Le terme de recherche ne peut pas être vide" });
                }

                var services = await _serviceService.SearchServicesAsync(term);
                return Ok(services);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la recherche de services", error = ex.Message });
            }
        }
    }
} 