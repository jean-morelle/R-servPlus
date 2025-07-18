using RéservPlus.Application.DTOs;

namespace RéservPlus.Application.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationDto>> GetAllNotificationsAsync();
        Task<NotificationDto?> GetNotificationByIdAsync(int id);
        Task<IEnumerable<NotificationDto>> GetNotificationsByUserAsync(Guid userId);
        Task<IEnumerable<NotificationDto>> GetUnreadNotificationsByUserAsync(Guid userId);
        Task<int> GetUnreadCountByUserAsync(Guid userId);
        Task<NotificationDto> CreateNotificationAsync(CreateNotificationRequest request);
        Task<NotificationDto> UpdateNotificationAsync(int id, UpdateNotificationRequest request);
        Task DeleteNotificationAsync(int id);
        Task<NotificationDto> MarkAsReadAsync(int id);
        Task MarkAllAsReadByUserAsync(Guid userId);
    }
} 