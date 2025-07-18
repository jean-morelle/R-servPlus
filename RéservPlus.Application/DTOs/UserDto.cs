using System.ComponentModel.DataAnnotations;

namespace RéservPlus.Application.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Nom { get; set; } = default!;
        public string Prenom { get; set; } = default!;
        public string Email { get; set; } = default!;
        public DateTime DateInscription { get; set; }
        public ICollection<ReservationDto> Reservations { get; set; } = new List<ReservationDto>();
    }

    public class CreateUserDto
    {
        [Required]
        [StringLength(100)]
        public string Nom { get; set; } = default!;

        [Required]
        [StringLength(100)]
        public string Prenom { get; set; } = default!;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = default!;

        [Required]
        [StringLength(255)]
        public string MotDePasse { get; set; } = default!;
    }

    public class UpdateUserDto
    {
        [Required]
        [StringLength(100)]
        public string Nom { get; set; } = default!;

        [Required]
        [StringLength(100)]
        public string Prenom { get; set; } = default!;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = default!;
    }
} 