using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Mappings
{
    public class UserMapping : Profile
    {
        public UserMapping()
        {
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Reservations, opt => opt.MapFrom(src => src.Reservations));

            CreateMap<CreateUserDto, User>()
                .ForMember(dest => dest.DateInscription, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UpdateUserDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.DateInscription, opt => opt.Ignore())
                .ForMember(dest => dest.MotDePasse, opt => opt.Ignore())
                .ForMember(dest => dest.Reservations, opt => opt.Ignore());
        }
    }
} 