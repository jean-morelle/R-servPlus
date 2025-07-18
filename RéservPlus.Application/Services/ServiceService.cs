using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Interfaces;

namespace RéservPlus.Application.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IMapper _mapper;

        public ServiceService(IServiceRepository serviceRepository, IMapper mapper)
        {
            _serviceRepository = serviceRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ServiceDto>> GetAllServicesAsync()
        {
            var services = await _serviceRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ServiceDto>>(services);
        }

        public async Task<ServiceDto?> GetServiceByIdAsync(Guid id)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            return _mapper.Map<ServiceDto>(service);
        }

        public async Task<IEnumerable<ServiceDto>> GetServicesByPrestataireAsync(Guid prestataireId)
        {
            var services = await _serviceRepository.GetByPrestataireIdAsync(prestataireId);
            return _mapper.Map<IEnumerable<ServiceDto>>(services);
        }

        public async Task<IEnumerable<ServiceDto>> GetServicesByTypeAsync(string type)
        {
            var services = await _serviceRepository.GetByTypeAsync(type);
            return _mapper.Map<IEnumerable<ServiceDto>>(services);
        }

        public async Task<ServiceDto> CreateServiceAsync(CreateServiceDto createDto)
        {
            // Validation métier
            if (await _serviceRepository.ServiceExistsForPrestataireAsync(createDto.PrestataireId, createDto.Nom))
            {
                throw new InvalidOperationException("Un service avec ce nom existe déjà pour ce prestataire.");
            }

            var service = _mapper.Map<Domain.Models.Service>(createDto);
            var createdService =  _serviceRepository.CreateAsync(service);
            return _mapper.Map<ServiceDto>(createdService);
        }

        public async Task UpdateServiceAsync(Guid id, UpdateServiceDto updateDto)
        {
            var existingService = await _serviceRepository.GetByIdAsync(id);
            if (existingService == null)
            {
                throw new InvalidOperationException("Service non trouvé.");
            }

            // Vérifier si le nom existe déjà pour ce prestataire (sauf pour ce service)
            if (await _serviceRepository.ServiceExistsForPrestataireAsync(updateDto.PrestataireId, updateDto.Nom))
            {
                var existingWithSameName = await _serviceRepository.GetFirstOrDefaultAsync(s => 
                    s.PrestataireId == updateDto.PrestataireId && s.Nom == updateDto.Nom && s.Id != id);
                
                if (existingWithSameName != null)
                {
                    throw new InvalidOperationException("Un autre service avec ce nom existe déjà pour ce prestataire.");
                }
            }

            _mapper.Map(updateDto, existingService);
            await _serviceRepository.UpdateAsync(existingService);
        }

        public async Task DeleteServiceAsync(Guid id)
        {
            var service = await _serviceRepository.GetByIdAsync(id);
            if (service == null)
            {
                throw new InvalidOperationException("Service non trouvé.");
            }

            await _serviceRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ServiceDto>> SearchServicesAsync(string searchTerm)
        {
            var services = await _serviceRepository.SearchByNameAsync(searchTerm);
            return _mapper.Map<IEnumerable<ServiceDto>>(services);
        }
    }
} 