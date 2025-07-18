using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Mappings
{
    public class PaiementMapping : Profile
    {
        public PaiementMapping()
        {
            CreateMap<Paiement, PaiementDto>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
                .ForMember(dest => dest.Methode, opt => opt.MapFrom(src => src.Methode));
            CreateMap<CreatePaiementDto, Paiement>()
                .ForMember(dest => dest.Statut, opt => opt.MapFrom(src => PaiementStatut.EnAttente))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Methode, opt => opt.MapFrom(src => src.Methode));
            CreateMap<UpdatePaiementDto, Paiement>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ReservationId, opt => opt.Ignore())
                .ForMember(dest => dest.Montant, opt => opt.Ignore())
                .ForMember(dest => dest.Methode, opt => opt.Ignore())
                .ForMember(dest => dest.Date, opt => opt.Ignore());
        }
    }
} 