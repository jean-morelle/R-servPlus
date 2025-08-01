using Microsoft.EntityFrameworkCore;
using RéservPlus.Domain.Models;

namespace RéservPlus.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Prestataire> Prestataires { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Disponibilite> Disponibilites { get; set; }
        public DbSet<Paiement> Paiements { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration des relations
            modelBuilder.Entity<Service>()
                .HasOne(s => s.Prestataire)
                .WithMany(p => p.Services)
                .HasForeignKey(s => s.PrestataireId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reservations)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Service)
                .WithMany(s => s.Reservations)
                .HasForeignKey(r => r.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Paiement)
                .WithOne(p => p.Reservation)
                .HasForeignKey<Reservation>(r => r.PaiementId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Disponibilite>()
                .HasOne(d => d.Service)
                .WithMany(s => s.Disponibilites)
                .HasForeignKey(d => d.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Paiement>()
                .HasOne(p => p.Reservation)
                .WithOne(r => r.Paiement)
                .HasForeignKey<Paiement>(p => p.ReservationId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuration des index
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Prestataire>()
                .HasIndex(p => p.Email)
                .IsUnique();

            modelBuilder.Entity<Service>()
                .HasIndex(s => new { s.PrestataireId, s.Nom });

            modelBuilder.Entity<Reservation>()
                .HasIndex(r => new { r.UserId, r.DateReservation });

            modelBuilder.Entity<Disponibilite>()
                .HasIndex(d => new { d.ServiceId, d.Date, d.HeureDebut });

            // Configuration des valeurs par défaut
            modelBuilder.Entity<User>()
                .Property(u => u.DateInscription)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<Reservation>()
                .Property(r => r.DateCreation)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<Paiement>()
                .Property(p => p.Date)
                .HasDefaultValueSql("GETUTCDATE()");

            // Configuration des clés Guid pour génération automatique
            modelBuilder.Entity<User>()
                .Property(u => u.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Prestataire>()
                .Property(p => p.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Service>()
                .Property(s => s.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Reservation>()
                .Property(r => r.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Disponibilite>()
                .Property(d => d.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Paiement>()
                .Property(p => p.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Notification>()
                .Property(n => n.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Notification>()
                .Property(n => n.DateCreation)
                .HasDefaultValueSql("GETUTCDATE()");

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Reservation)
                .WithMany()
                .HasForeignKey(n => n.ReservationId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Paiement)
                .WithMany()
                .HasForeignKey(n => n.PaiementId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
} 