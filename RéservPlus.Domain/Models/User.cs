using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RéservPlus.Domain.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = default!;
        
        [Required]
        [StringLength(100)]
        public string Nom { get; set; } = default!;
        
        [Required]
        [StringLength(100)]
        public string Prenom { get; set; } = default!;
        
        [Required]
        [StringLength(255)]
        public string MotDePasse { get; set; } = default!;
        
        [Required]
        public DateTime DateInscription { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
