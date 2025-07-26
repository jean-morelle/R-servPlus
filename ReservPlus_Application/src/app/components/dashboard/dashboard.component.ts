import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PrestataireService } from '../../services/prestataire.service';
import { DisponibiliteService } from '../../services/disponibilite.service';
import { PaiementService } from '../../services/paiement.service';
import { ReservationService } from '../../services/reservation.service';
import { UserInfo } from '../../models/auth.model';
import { ReservationStatut } from '../../models/reservation.model';
import { StatutPaiement } from '../../models/paiement.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  currentUser: UserInfo | null = null;
  loading = false;
  stats = {
    totalUsers: 0,
    totalPrestataires: 0,
    totalDisponibilites: 0,
    totalPaiements: 0,
    totalReservations: 0,
    paiementsValides: 0,
    disponibilitesDisponibles: 0,
    reservationsConfirmees: 0,
    reservationsEnAttente: 0
  };

  recentActivities: any[] = [];
  quickActions = [
    {
      title: 'Nouvelle réservation',
      icon: 'fas fa-calendar-plus',
      route: '/reservations',
      color: '#17a2b8'
    },
    {
      title: 'Voir le calendrier',
      icon: 'fas fa-calendar-alt',
      route: '/calendar',
      color: '#6f42c1'
    },
    {
      title: 'Ajouter un utilisateur',
      icon: 'fas fa-user-plus',
      route: '/users',
      color: '#007bff'
    },
    {
      title: 'Ajouter un prestataire',
      icon: 'fas fa-user-tie',
      route: '/prestataires',
      color: '#28a745'
    },
    {
      title: 'Gérer les disponibilités',
      icon: 'fas fa-calendar-alt',
      route: '/disponibilites',
      color: '#ffc107'
    },
    {
      title: 'Voir les paiements',
      icon: 'fas fa-credit-card',
      route: '/paiements',
      color: '#dc3545'
    }
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private prestataireService: PrestataireService,
    private disponibiliteService: DisponibiliteService,
    private paiementService: PaiementService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Charger les statistiques
    Promise.all([
      this.loadUsersStats(),
      this.loadPrestatairesStats(),
      this.loadDisponibilitesStats(),
      this.loadPaiementsStats(),
      this.loadReservationsStats()
    ]).finally(() => {
      this.loading = false;
    });
  }

  private loadUsersStats(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.stats.totalUsers = users.length;
          resolve();
        },
        error: () => {
          this.stats.totalUsers = 0;
          resolve();
        }
      });
    });
  }

  private loadPrestatairesStats(): Promise<void> {
    return new Promise((resolve) => {
      this.prestataireService.getAllPrestataires().subscribe({
        next: (prestataires) => {
          this.stats.totalPrestataires = prestataires.length;
          resolve();
        },
        error: () => {
          this.stats.totalPrestataires = 0;
          resolve();
        }
      });
    });
  }

  private loadDisponibilitesStats(): Promise<void> {
    return new Promise((resolve) => {
      this.disponibiliteService.getAllDisponibilites().subscribe({
        next: (disponibilites) => {
          this.stats.totalDisponibilites = disponibilites.length;
          this.stats.disponibilitesDisponibles = disponibilites.filter(d => d.estDisponible).length;
          resolve();
        },
        error: () => {
          this.stats.totalDisponibilites = 0;
          this.stats.disponibilitesDisponibles = 0;
          resolve();
        }
      });
    });
  }

  private loadPaiementsStats(): Promise<void> {
    return new Promise((resolve) => {
      this.paiementService.getAllPaiements().subscribe({
        next: (paiements) => {
          this.stats.totalPaiements = paiements.length;
          this.stats.paiementsValides = paiements.filter(p => p.statut === StatutPaiement.Valide).length;
          resolve();
        },
        error: () => {
          this.stats.totalPaiements = 0;
          this.stats.paiementsValides = 0;
          resolve();
        }
      });
    });
  }

  private loadReservationsStats(): Promise<void> {
    return new Promise((resolve) => {
      this.reservationService.getAllReservations().subscribe({
        next: (reservations) => {
          this.stats.totalReservations = reservations.length;
          this.stats.reservationsConfirmees = reservations.filter(r => r.statut === ReservationStatut.Confirmee).length;
          this.stats.reservationsEnAttente = reservations.filter(r => r.statut === ReservationStatut.EnAttente).length;
          resolve();
        },
        error: () => {
          this.stats.totalReservations = 0;
          this.stats.reservationsConfirmees = 0;
          this.stats.reservationsEnAttente = 0;
          resolve();
        }
      });
    });
  }

  getWelcomeMessage(): string {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) {
      greeting = 'Bonjour';
    } else if (hour < 18) {
      greeting = 'Bon après-midi';
    } else {
      greeting = 'Bonsoir';
    }
    
    return `${greeting}, ${this.currentUser?.prenom || 'Utilisateur'} !`;
  }

  getTimeOfDay(): string {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return 'Matin';
    } else if (hour < 18) {
      return 'Après-midi';
    } else {
      return 'Soirée';
    }
  }

  getCurrentDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('fr-FR', options);
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  logout(): void {
    this.authService.logout();
  }
} 