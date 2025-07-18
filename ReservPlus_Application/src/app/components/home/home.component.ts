import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  users: any[] = [];

  features = [
    {
      icon: 'fas fa-calendar-check',
      title: 'Gestion des Réservations',
      description: 'Planifiez et gérez facilement vos rendez-vous avec une interface intuitive et moderne.',
      color: '#007bff'
    },
    {
      icon: 'fas fa-user-tie',
      title: 'Gestion des Prestataires',
      description: 'Organisez votre équipe de prestataires avec des profils détaillés et des spécialisations.',
      color: '#28a745'
    },
    {
      icon: 'fas fa-clock',
      title: 'Disponibilités en Temps Réel',
      description: 'Consultez les créneaux disponibles en temps réel et optimisez votre planning.',
      color: '#17a2b8'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'Paiements Sécurisés',
      description: 'Gérez les paiements de manière sécurisée avec un suivi complet des transactions.',
      color: '#ffc107'
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Rapports et Analyses',
      description: 'Analysez vos performances avec des rapports détaillés et des statistiques avancées.',
      color: '#6f42c1'
    },
    {
      icon: 'fas fa-bell',
      title: 'Notifications Intelligentes',
      description: 'Recevez des notifications en temps réel pour rester informé de vos activités.',
      color: '#dc3545'
    }
  ];

  testimonials = [
    {
      name: 'Marie Dubois',
      role: 'Gérante de Salon',
      content: 'RéservPlus a révolutionné la gestion de mon salon. Plus de double réservation et une organisation parfaite !',
      avatar: '👩‍💼'
    },
    {
      name: 'Jean Martin',
      role: 'Coach Sportif',
      content: 'L\'interface est intuitive et mes clients adorent pouvoir réserver en ligne. Un vrai gain de temps !',
      avatar: '🏃‍♂️'
    },
    {
      name: 'Sophie Bernard',
      role: 'Consultante',
      content: 'Les rapports m\'aident à optimiser mon planning et à mieux comprendre mes clients.',
      avatar: '👩‍💻'
    }
  ];

  stats = [
    { number: '1000+', label: 'Réservations gérées' },
    { number: '50+', label: 'Prestataires satisfaits' },
    { number: '99%', label: 'Taux de satisfaction' },
    { number: '24/7', label: 'Support disponible' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    this.loadUsers();
  }

  onGetStarted(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onLearnMore(): void {
    // Scroll vers la section des fonctionnalités
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }

  onContact(): void {
    // Scroll vers la section contact
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  onFeatureClick(feature: any): void {
    if (this.isAuthenticated) {
      // Rediriger vers la fonctionnalité correspondante
      switch (feature.title) {
        case 'Gestion des Réservations':
          this.router.navigate(['/reservations']);
          break;
        case 'Gestion des Prestataires':
          this.router.navigate(['/prestataires']);
          break;
        case 'Disponibilités en Temps Réel':
          this.router.navigate(['/disponibilites']);
          break;
        case 'Paiements Sécurisés':
          this.router.navigate(['/paiements']);
          break;
        case 'Rapports et Analyses':
          this.router.navigate(['/reports']);
          break;
        case 'Notifications Intelligentes':
          this.router.navigate(['/dashboard']);
          break;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  getWelcomeMessage(): string {
    if (this.isAuthenticated && this.currentUser) {
      return `Bienvenue, ${this.currentUser.prenom} !`;
    }
    return 'Bienvenue sur RéservPlus';
  }

  getSubtitle(): string {
    if (this.isAuthenticated) {
      return 'Accédez à votre tableau de bord pour gérer vos réservations';
    }
    return 'La solution complète pour gérer vos réservations et optimiser votre planning';
  }

  private loadUsers(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.users = users;
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
          resolve();
        }
      });
    });
  }
} 