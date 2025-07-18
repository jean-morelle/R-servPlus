using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Services;
using RéservPlus.Domain.Interfaces;

namespace RéservPlus.Application.Services
{
    public class PrestataireService : IPrestataireService
    {
        private readonly IPrestataireRepository _prestataireRepository;
        private readonly IMapper _mapper;

        public PrestataireService(IPrestataireRepository prestataireRepository, IMapper mapper)
        {
            _prestataireRepository = prestataireRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PrestataireDto>> GetAllAsync()
        {
            var prestataires = await _prestataireRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PrestataireDto>>(prestataires);
        }

        public async Task<PrestataireDto?> GetByIdAsync(Guid id)
        {
            var prestataire = await _prestataireRepository.GetByIdAsync(id);
            return _mapper.Map<PrestataireDto>(prestataire);
        }

        public async Task<PrestataireDto> CreateAsync(CreatePrestataireDto createDto)
        {
            var prestataire = _mapper.Map<Domain.Models.Prestataire>(createDto);
            var createdPrestataire = await _prestataireRepository.AddAsync(prestataire);
            return _mapper.Map<PrestataireDto>(createdPrestataire);
        }

        public async Task<PrestataireDto> UpdateAsync(Guid id, UpdatePrestataireDto updateDto)
        {
            var existingPrestataire = await _prestataireRepository.GetByIdAsync(id);
            if (existingPrestataire == null)
                throw new ArgumentException("Prestataire not found", nameof(id));

            _mapper.Map(updateDto, existingPrestataire);
            var updatedPrestataire = await _prestataireRepository.UpdateAsync(existingPrestataire);
            return _mapper.Map<PrestataireDto>(updatedPrestataire);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _prestataireRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<PrestataireDto>> GetByNomCommercialAsync(string nomCommercial)
        {
            var prestataires = await _prestataireRepository.GetByNomCommercialAsync(nomCommercial);
            return _mapper.Map<IEnumerable<PrestataireDto>>(prestataires);
        }
    }
} 