using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Mappings
{
    public class ReservationMapping : Profile
    {
        public ReservationMapping()
        {
            CreateMap<Reservation, ReservationDto>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
                .ForMember(dest => dest.Service, opt => opt.MapFrom(src => src.Service))
                .ForMember(dest => dest.Paiement, opt => opt.MapFrom(src => src.Paiement));

            CreateMap<CreateReservationDto, Reservation>()
                .ForMember(dest => dest.Statut, opt => opt.MapFrom(src => ReservationStatut.EnAttente))
                .ForMember(dest => dest.DateCreation, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UpdateReservationDto, Reservation>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceId, opt => opt.Ignore())
                .ForMember(dest => dest.DateCreation, opt => opt.Ignore())
                .ForMember(dest => dest.PaiementId, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.Paiement, opt => opt.Ignore());

            CreateMap<ReservationStatutDto, Reservation>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Statut, opt => opt.MapFrom(src => src.Statut))
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceId, opt => opt.Ignore())
                .ForMember(dest => dest.DateReservation, opt => opt.Ignore())
                .ForMember(dest => dest.HeureDebut, opt => opt.Ignore())
                .ForMember(dest => dest.HeureFin, opt => opt.Ignore())
                .ForMember(dest => dest.MontantTotal, opt => opt.Ignore())
                .ForMember(dest => dest.DateCreation, opt => opt.Ignore())
                .ForMember(dest => dest.PaiementId, opt => opt.Ignore())
                .ForMember(dest => dest.Notes, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.Paiement, opt => opt.Ignore());
        }
    }
} 