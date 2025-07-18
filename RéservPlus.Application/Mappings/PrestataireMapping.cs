using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Mappings
{
    public class PrestataireMapping : Profile
    {
        public PrestataireMapping()
        {
            CreateMap<Prestataire, PrestataireDto>()
                .ForMember(dest => dest.Services, opt => opt.MapFrom(src => src.Services));

            CreateMap<CreatePrestataireDto, Prestataire>();

            CreateMap<UpdatePrestataireDto, Prestataire>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Services, opt => opt.Ignore());
        }
    }
} 