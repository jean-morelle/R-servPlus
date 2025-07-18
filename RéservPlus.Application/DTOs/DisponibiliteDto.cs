using RéservPlus.Domain.Models;

namespace RéservPlus.Application.DTOs
{
    public class DisponibiliteDto
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan HeureDebut { get; set; }
        public TimeSpan HeureFin { get; set; }
        public bool EstDisponible { get; set; }
        public Guid ServiceId { get; set; }
        public ServiceDto? Service { get; set; }
        public DateTime DateHeureDebut { get; set; }
        public DateTime DateHeureFin { get; set; }
    }

    public class CreateDisponibiliteDto
    {
        public DateTime Date { get; set; }
        public TimeSpan HeureDebut { get; set; }
        public TimeSpan HeureFin { get; set; }
        public bool EstDisponible { get; set; } = true;
        public Guid ServiceId { get; set; }
    }

    public class UpdateDisponibiliteDto
    {
        public DateTime Date { get; set; }
        public TimeSpan HeureDebut { get; set; }
        public TimeSpan HeureFin { get; set; }
        public bool EstDisponible { get; set; }
    }

    public class DisponibiliteSearchDto
    {
        public Guid ServiceId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? EstDisponible { get; set; }
    }
} 