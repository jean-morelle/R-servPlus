using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Interfaces;
using RéservPlus.Domain.Interfaces;

namespace RéservPlus.Application.Services
{
    public class DisponibiliteService : IDisponibiliteService
    {
        private readonly IDisponibiliteRepository _disponibiliteRepository;
        private readonly IMapper _mapper;

        public DisponibiliteService(IDisponibiliteRepository disponibiliteRepository, IMapper mapper)
        {
            _disponibiliteRepository = disponibiliteRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DisponibiliteDto>> GetAllAsync()
        {
            var disponibilites = await _disponibiliteRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<DisponibiliteDto>>(disponibilites);
        }

        public async Task<DisponibiliteDto?> GetByIdAsync(Guid id)
        {
            var disponibilite = await _disponibiliteRepository.GetByIdAsync(id);
            return _mapper.Map<DisponibiliteDto>(disponibilite);
        }

        public async Task<IEnumerable<DisponibiliteDto>> GetByServiceIdAsync(Guid serviceId)
        {
            var disponibilites = await _disponibiliteRepository.GetByServiceIdAsync(serviceId);
            return _mapper.Map<IEnumerable<DisponibiliteDto>>(disponibilites);
        }

        public async Task<IEnumerable<DisponibiliteDto>> GetByDateAsync(DateTime date)
        {
            var disponibilites = await _disponibiliteRepository.GetByDateAsync(date);
            return _mapper.Map<IEnumerable<DisponibiliteDto>>(disponibilites);
        }

        public async Task<IEnumerable<DisponibiliteDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var disponibilites = await _disponibiliteRepository.GetByDateRangeAsync(startDate, endDate);
            return _mapper.Map<IEnumerable<DisponibiliteDto>>(disponibilites);
        }

        public async Task<IEnumerable<DisponibiliteDto>> GetAvailableByServiceIdAsync(Guid serviceId)
        {
            var disponibilites = await _disponibiliteRepository.GetAvailableByServiceIdAsync(serviceId);
            return _mapper.Map<IEnumerable<DisponibiliteDto>>(disponibilites);
        }

        public async Task<IEnumerable<DisponibiliteDto>> GetAvailableByDateRangeAsync(Guid serviceId, DateTime startDate, DateTime endDate)
        {
            var disponibilites = await _disponibiliteRepository.GetAvailableByDateRangeAsync(serviceId, startDate, endDate);
            return _mapper.Map<IEnumerable<DisponibiliteDto>>(disponibilites);
        }

        public async Task<DisponibiliteDto> CreateAsync(CreateDisponibiliteDto createDto)
        {
            // Validation des heures
            if (createDto.HeureDebut >= createDto.HeureFin)
                throw new ArgumentException("L'heure de début doit être antérieure à l'heure de fin");

            // Vérifier si le créneau n'est pas déjà pris
            var isAvailable = await _disponibiliteRepository.IsTimeSlotAvailableAsync(
                createDto.ServiceId, createDto.Date, createDto.HeureDebut, createDto.HeureFin);
            
            if (!isAvailable)
                throw new InvalidOperationException("Ce créneau horaire n'est pas disponible");

            var disponibilite = _mapper.Map<Domain.Models.Disponibilite>(createDto);
            var createdDisponibilite = await _disponibiliteRepository.AddAsync(disponibilite);
            return _mapper.Map<DisponibiliteDto>(createdDisponibilite);
        }

        public async Task<DisponibiliteDto> UpdateAsync(Guid id, UpdateDisponibiliteDto updateDto)
        {
            var existingDisponibilite = await _disponibiliteRepository.GetByIdAsync(id);
            if (existingDisponibilite == null)
                throw new ArgumentException("Disponibilité non trouvée");

            // Validation des heures
            if (updateDto.HeureDebut >= updateDto.HeureFin)
                throw new ArgumentException("L'heure de début doit être antérieure à l'heure de fin");

            _mapper.Map(updateDto, existingDisponibilite);
            var updatedDisponibilite = await _disponibiliteRepository.UpdateAsync(existingDisponibilite);
            return _mapper.Map<DisponibiliteDto>(updatedDisponibilite);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _disponibiliteRepository.DeleteAsync(id);
        }

        public async Task<bool> IsTimeSlotAvailableAsync(Guid serviceId, DateTime date, TimeSpan heureDebut, TimeSpan heureFin)
        {
            return await _disponibiliteRepository.IsTimeSlotAvailableAsync(serviceId, date, heureDebut, heureFin);
        }

        public async Task<IEnumerable<DisponibiliteDto>> SearchAsync(DisponibiliteSearchDto searchDto)
        {
            var disponibilites = await _disponibiliteRepository.GetByServiceIdAsync(searchDto.ServiceId);
            
            var filteredDisponibilites = disponibilites.AsEnumerable();

            if (searchDto.StartDate.HasValue)
                filteredDisponibilites = filteredDisponibilites.Where(d => d.Date >= searchDto.StartDate.Value);

            if (searchDto.EndDate.HasValue)
                filteredDisponibilites = filteredDisponibilites.Where(d => d.Date <= searchDto.EndDate.Value);

            if (searchDto.EstDisponible.HasValue)
                filteredDisponibilites = filteredDisponibilites.Where(d => d.EstDisponible == searchDto.EstDisponible.Value);

            return _mapper.Map<IEnumerable<DisponibiliteDto>>(filteredDisponibilites);
        }

        public async Task<DisponibiliteDto> MarkAsUnavailableAsync(Guid id)
        {
            var disponibilite = await _disponibiliteRepository.GetByIdAsync(id);
            if (disponibilite == null)
                throw new ArgumentException("Disponibilité non trouvée");

            disponibilite.EstDisponible = false;
            var updatedDisponibilite = await _disponibiliteRepository.UpdateAsync(disponibilite);
            return _mapper.Map<DisponibiliteDto>(updatedDisponibilite);
        }

        public async Task<DisponibiliteDto> MarkAsAvailableAsync(Guid id)
        {
            var disponibilite = await _disponibiliteRepository.GetByIdAsync(id);
            if (disponibilite == null)
                throw new ArgumentException("Disponibilité non trouvée");

            disponibilite.EstDisponible = true;
            var updatedDisponibilite = await _disponibiliteRepository.UpdateAsync(disponibilite);
            return _mapper.Map<DisponibiliteDto>(updatedDisponibilite);
        }
    }
} 