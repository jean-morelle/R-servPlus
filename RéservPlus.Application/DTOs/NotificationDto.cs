using RéservPlus.Domain.Models;

namespace RéservPlus.Application.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Titre { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public bool Lu { get; set; }
        public DateTime DateCreation { get; set; }
        public DateTime? DateLecture { get; set; }
        public string? Lien { get; set; }
        public Guid? ReservationId { get; set; }
        public Guid? PaiementId { get; set; }
        public Guid UserId { get; set; }
    }

    public class CreateNotificationRequest
    {
        public string Titre { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public string? Lien { get; set; }
        public Guid? ReservationId { get; set; }
        public Guid? PaiementId { get; set; }
        public Guid? UserId { get; set; }
    }

    public class UpdateNotificationRequest
    {
        public bool? Lu { get; set; }
        public DateTime? DateLecture { get; set; }
    }
} 