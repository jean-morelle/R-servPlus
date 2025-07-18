using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Mappings
{
    public class PaiementMappingProfile : Profile
    {
        public PaiementMappingProfile()
        {
            CreateMap<Paiement, PaiementDto>()
                .ForMember(dest => dest.Reservation, opt => opt.MapFrom(src => src.Reservation));

            CreateMap<CreatePaiementDto, Paiement>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Statut, opt => opt.MapFrom(src => PaiementStatut.EnAttente))
                .ForMember(dest => dest.Reservation, opt => opt.Ignore());

            CreateMap<UpdatePaiementDto, Paiement>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Date, opt => opt.Ignore())
                .ForMember(dest => dest.ReservationId, opt => opt.Ignore())
                .ForMember(dest => dest.Reservation, opt => opt.Ignore());
        }
    }
} 