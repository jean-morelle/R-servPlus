using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Services;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly IMapper _mapper;

        public ReservationService(IReservationRepository reservationRepository, IMapper mapper)
        {
            _reservationRepository = reservationRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ReservationDto>> GetAllAsync()
        {
            var reservations = await _reservationRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ReservationDto>>(reservations);
        }

        public async Task<ReservationDto?> GetByIdAsync(Guid id)
        {
            var reservation = await _reservationRepository.GetByIdAsync(id);
            return _mapper.Map<ReservationDto>(reservation);
        }

        public async Task<ReservationDto> CreateAsync(CreateReservationDto createDto)
        {
            // Vérifier la disponibilité avant de créer la réservation
            var isAvailable = await _reservationRepository.CheckDisponibiliteAsync(
                createDto.ServiceId, 
                createDto.DateReservation, 
                createDto.HeureDebut, 
                createDto.HeureFin);

            if (!isAvailable)
                throw new InvalidOperationException("Le créneau demandé n'est pas disponible");

            var reservation = _mapper.Map<Domain.Models.Reservation>(createDto);
            var createdReservation = await _reservationRepository.AddAsync(reservation);
            return _mapper.Map<ReservationDto>(createdReservation);
        }

        public async Task<ReservationDto> UpdateAsync(Guid id, UpdateReservationDto updateDto)
        {
            var existingReservation = await _reservationRepository.GetByIdAsync(id);
            if (existingReservation == null)
                throw new ArgumentException("Reservation not found", nameof(id));

            // Vérifier la disponibilité si la date ou l'heure change
            if (existingReservation.DateReservation != updateDto.DateReservation ||
                existingReservation.HeureDebut != updateDto.HeureDebut ||
                existingReservation.HeureFin != updateDto.HeureFin)
            {
                var isAvailable = await _reservationRepository.CheckDisponibiliteAsync(
                    existingReservation.ServiceId,
                    updateDto.DateReservation,
                    updateDto.HeureDebut,
                    updateDto.HeureFin,
                    id);

                if (!isAvailable)
                    throw new InvalidOperationException("Le créneau demandé n'est pas disponible");
            }

            _mapper.Map(updateDto, existingReservation);
            var updatedReservation = await _reservationRepository.UpdateAsync(existingReservation);
            return _mapper.Map<ReservationDto>(updatedReservation);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _reservationRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ReservationDto>> GetByUserIdAsync(Guid userId)
        {
            var reservations = await _reservationRepository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<ReservationDto>>(reservations);
        }

        public async Task<IEnumerable<ReservationDto>> GetByServiceIdAsync(Guid serviceId)
        {
            var reservations = await _reservationRepository.GetByServiceIdAsync(serviceId);
            return _mapper.Map<IEnumerable<ReservationDto>>(reservations);
        }

        public async Task<IEnumerable<ReservationDto>> GetByDateAsync(DateTime date)
        {
            var reservations = await _reservationRepository.GetByDateAsync(date);
            return _mapper.Map<IEnumerable<ReservationDto>>(reservations);
        }

        public async Task<IEnumerable<ReservationDto>> GetByStatutAsync(ReservationStatut statut)
        {
            var reservations = await _reservationRepository.GetByStatutAsync(statut);
            return _mapper.Map<IEnumerable<ReservationDto>>(reservations);
        }

        public async Task<IEnumerable<ReservationDto>> GetByDateRangeAsync(DateTime dateDebut, DateTime dateFin)
        {
            var reservations = await _reservationRepository.GetByDateRangeAsync(dateDebut, dateFin);
            return _mapper.Map<IEnumerable<ReservationDto>>(reservations);
        }

        public async Task<bool> CheckDisponibiliteAsync(Guid serviceId, DateTime date, TimeSpan heureDebut, TimeSpan heureFin, Guid? excludeReservationId = null)
        {
            return await _reservationRepository.CheckDisponibiliteAsync(serviceId, date, heureDebut, heureFin, excludeReservationId);
        }

        public async Task<ReservationDto> UpdateStatutAsync(Guid id, ReservationStatut statut)
        {
            var existingReservation = await _reservationRepository.GetByIdAsync(id);
            if (existingReservation == null)
                throw new ArgumentException("Reservation not found", nameof(id));

            existingReservation.Statut = statut;
            var updatedReservation = await _reservationRepository.UpdateAsync(existingReservation);
            return _mapper.Map<ReservationDto>(updatedReservation);
        }
    }
} 