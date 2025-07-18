using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Mappings
{
    public class ServiceMapping : Profile
    {
        public ServiceMapping()
        {
            CreateMap<Service, ServiceDto>()
                .ForMember(dest => dest.PrestataireNom, opt => opt.MapFrom(src => src.Prestataire != null ? src.Prestataire.NomCommercial : string.Empty));

            CreateMap<CreateServiceDto, Service>();

            CreateMap<UpdateServiceDto, Service>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Prestataire, opt => opt.Ignore());
        }
    }
} 