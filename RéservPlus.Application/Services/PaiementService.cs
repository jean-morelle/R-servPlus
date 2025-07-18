using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Interfaces;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Services
{
    public class PaiementService : IPaiementService
    {
        private readonly IPaiementRepository _paiementRepository;
        private readonly IMapper _mapper;

        public PaiementService(IPaiementRepository paiementRepository, IMapper mapper)
        {
            _paiementRepository = paiementRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PaiementDto>> GetAllAsync()
        {
            var paiements = await _paiementRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PaiementDto>>(paiements);
        }

        public async Task<PaiementDto?> GetByIdAsync(Guid id)
        {
            var paiement = await _paiementRepository.GetByIdAsync(id);
            return _mapper.Map<PaiementDto>(paiement);
        }

        public async Task<IEnumerable<PaiementDto>> GetByReservationIdAsync(Guid reservationId)
        {
            var paiements = await _paiementRepository.GetByReservationIdAsync(reservationId);
            return _mapper.Map<IEnumerable<PaiementDto>>(paiements);
        }

        public async Task<IEnumerable<PaiementDto>> GetByStatutAsync(PaiementStatut statut)
        {
            var paiements = await _paiementRepository.GetByStatutAsync(statut);
            return _mapper.Map<IEnumerable<PaiementDto>>(paiements);
        }

        public async Task<IEnumerable<PaiementDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var paiements = await _paiementRepository.GetByDateRangeAsync(startDate, endDate);
            return _mapper.Map<IEnumerable<PaiementDto>>(paiements);
        }

        public async Task<PaiementDto> CreateAsync(CreatePaiementDto createDto)
        {
            var paiement = _mapper.Map<Paiement>(createDto);
            var createdPaiement = await _paiementRepository.AddAsync(paiement);
            return _mapper.Map<PaiementDto>(createdPaiement);
        }

        public async Task<PaiementDto> UpdateAsync(Guid id, UpdatePaiementDto updateDto)
        {
            var existingPaiement = await _paiementRepository.GetByIdAsync(id);
            if (existingPaiement == null)
                throw new ArgumentException("Paiement non trouvé");

            _mapper.Map(updateDto, existingPaiement);
            var updatedPaiement = await _paiementRepository.UpdateAsync(existingPaiement);
            return _mapper.Map<PaiementDto>(updatedPaiement);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _paiementRepository.DeleteAsync(id);
        }

        public async Task<PaiementDto> ValiderPaiementAsync(Guid id)
        {
            var paiement = await _paiementRepository.GetByIdAsync(id);
            if (paiement == null)
                throw new ArgumentException("Paiement non trouvé");

            paiement.Statut = PaiementStatut.Valide;
            var updatedPaiement = await _paiementRepository.UpdateAsync(paiement);
            return _mapper.Map<PaiementDto>(updatedPaiement);
        }

        public async Task<PaiementDto> RefuserPaiementAsync(Guid id)
        {
            var paiement = await _paiementRepository.GetByIdAsync(id);
            if (paiement == null)
                throw new ArgumentException("Paiement non trouvé");

            paiement.Statut = PaiementStatut.Refuse;
            var updatedPaiement = await _paiementRepository.UpdateAsync(paiement);
            return _mapper.Map<PaiementDto>(updatedPaiement);
        }

        public async Task<PaiementDto> RembourserPaiementAsync(Guid id)
        {
            var paiement = await _paiementRepository.GetByIdAsync(id);
            if (paiement == null)
                throw new ArgumentException("Paiement non trouvé");

            if (paiement.Statut != PaiementStatut.Valide)
                throw new InvalidOperationException("Seuls les paiements validés peuvent être remboursés");

            paiement.Statut = PaiementStatut.Rembourse;
            var updatedPaiement = await _paiementRepository.UpdateAsync(paiement);
            return _mapper.Map<PaiementDto>(updatedPaiement);
        }
    }
} 