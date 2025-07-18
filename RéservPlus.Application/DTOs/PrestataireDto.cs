using System.ComponentModel.DataAnnotations;

namespace RéservPlus.Application.DTOs
{
    public class PrestataireDto
    {
        public Guid Id { get; set; }
        public string NomCommercial { get; set; } = default!;
        public string Adresse { get; set; } = default!;
        public string Telephone { get; set; } = default!;
        public string Email { get; set; } = default!;
        public ICollection<ServiceDto> Services { get; set; } = new List<ServiceDto>();
    }

    public class CreatePrestataireDto
    {
        [Required]
        [StringLength(200)]
        public string NomCommercial { get; set; } = default!;

        [Required]
        [StringLength(500)]
        public string Adresse { get; set; } = default!;

        [Required]
        [StringLength(20)]
        public string Telephone { get; set; } = default!;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = default!;
    }

    public class UpdatePrestataireDto
    {
        [Required]
        [StringLength(200)]
        public string NomCommercial { get; set; } = default!;

        [Required]
        [StringLength(500)]
        public string Adresse { get; set; } = default!;

        [Required]
        [StringLength(20)]
        public string Telephone { get; set; } = default!;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = default!;
    }
} 