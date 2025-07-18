using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Mappings
{
    public class DisponibiliteMappingProfile : Profile
    {
        public DisponibiliteMappingProfile()
        {
            CreateMap<Disponibilite, DisponibiliteDto>()
                .ForMember(dest => dest.Service, opt => opt.MapFrom(src => src.Service))
                .ForMember(dest => dest.DateHeureDebut, opt => opt.MapFrom(src => src.DateHeureDebut))
                .ForMember(dest => dest.DateHeureFin, opt => opt.MapFrom(src => src.DateHeureFin));

            CreateMap<CreateDisponibiliteDto, Disponibilite>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.DateHeureDebut, opt => opt.Ignore())
                .ForMember(dest => dest.DateHeureFin, opt => opt.Ignore());

            CreateMap<UpdateDisponibiliteDto, Disponibilite>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceId, opt => opt.Ignore())
                .ForMember(dest => dest.Service, opt => opt.Ignore())
                .ForMember(dest => dest.DateHeureDebut, opt => opt.Ignore())
                .ForMember(dest => dest.DateHeureFin, opt => opt.Ignore());
        }
    }
} 