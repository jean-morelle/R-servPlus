using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Mappings
{
    public class NotificationMappingProfile : Profile
    {
        public NotificationMappingProfile()
        {
            CreateMap<Notification, NotificationDto>();
            CreateMap<CreateNotificationRequest, Notification>()
                .ForMember(dest => dest.DateCreation, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Lu, opt => opt.MapFrom(src => false));
            CreateMap<UpdateNotificationRequest, Notification>()
                .ForMember(dest => dest.DateLecture, opt => opt.MapFrom(src => 
                    src.Lu == true ? DateTime.UtcNow : src.DateLecture));
        }
    }
} 