using AutoMapper;
using RéservPlus.Application.DTOs;
using RéservPlus.Application.Interfaces;
using RéservPlus.Domain.Interfaces;
using RéservPlus.Domain.Models;

namespace RéservPlus.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;

        public NotificationService(INotificationRepository notificationRepository, IMapper mapper)
        {
            _notificationRepository = notificationRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<NotificationDto>> GetAllNotificationsAsync()
        {
            var notifications = await _notificationRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        }

        public async Task<NotificationDto?> GetNotificationByIdAsync(int id)
        {
            var notification = await _notificationRepository.GetByIdAsync(id);
            return _mapper.Map<NotificationDto?>(notification);
        }

        public async Task<IEnumerable<NotificationDto>> GetNotificationsByUserAsync(Guid userId)
        {
            var notifications = await _notificationRepository.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        }

        public async Task<IEnumerable<NotificationDto>> GetUnreadNotificationsByUserAsync(Guid userId)
        {
            var notifications = await _notificationRepository.GetUnreadByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        }

        public async Task<int> GetUnreadCountByUserAsync(Guid userId)
        {
            return await _notificationRepository.GetUnreadCountByUserIdAsync(userId);
        }

        public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationRequest request)
        {
            var notification = _mapper.Map<Notification>(request);
            var createdNotification = await _notificationRepository.CreateAsync(notification);
            return _mapper.Map<NotificationDto>(createdNotification);
        }

        public async Task<NotificationDto> UpdateNotificationAsync(int id, UpdateNotificationRequest request)
        {
            var existingNotification = await _notificationRepository.GetByIdAsync(id);
            if (existingNotification == null)
                throw new ArgumentException("Notification not found");

            _mapper.Map(request, existingNotification);
            var updatedNotification = await _notificationRepository.UpdateAsync(existingNotification);
            return _mapper.Map<NotificationDto>(updatedNotification);
        }

        public async Task DeleteNotificationAsync(int id)
        {
            await _notificationRepository.DeleteAsync(id);
        }

        public async Task<NotificationDto> MarkAsReadAsync(int id)
        {
            await _notificationRepository.MarkAsReadAsync(id);
            var notification = await _notificationRepository.GetByIdAsync(id);
            return _mapper.Map<NotificationDto>(notification);
        }

        public async Task MarkAllAsReadByUserAsync(Guid userId)
        {
            await _notificationRepository.MarkAllAsReadByUserIdAsync(userId);
        }
    }
} 