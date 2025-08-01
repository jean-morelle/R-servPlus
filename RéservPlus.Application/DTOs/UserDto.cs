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
        public string? Telephone { get; set; }
        public string? Ville { get; set; }
        public string? CodePostal { get; set; }
        public bool EstActif { get; set; }
        public string Role { get; set; } = "User";
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
        
        [StringLength(20)]
        public string? Telephone { get; set; }
        
        [StringLength(100)]
        public string? Ville { get; set; }
        
        [StringLength(10)]
        public string? CodePostal { get; set; }
        
        public bool EstActif { get; set; } = true;
        
        [StringLength(20)]
        public string Role { get; set; } = "User";
    }

    public class UpdateUserDto
    {
        [StringLength(100)]
        public string? Nom { get; set; }

        [StringLength(100)]
        public string? Prenom { get; set; }

        [EmailAddress]
        [StringLength(255)]
        public string? Email { get; set; }
        
        [StringLength(20)]
        public string? Telephone { get; set; }
        
        [StringLength(100)]
        public string? Ville { get; set; }
        
        [StringLength(10)]
        public string? CodePostal { get; set; }
        
        public bool? EstActif { get; set; }
        
        [StringLength(20)]
        public string? Role { get; set; }
    }
} 