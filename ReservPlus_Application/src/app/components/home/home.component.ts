import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { ROLES } from '../../models/auth.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  users: any[] = [];
  isAdmin = false;
  isPrestataire = false;
  isUser = false;

  features = [
    {
      title: 'Gestion des Réservations',
      description: 'Planifiez et gérez vos rendez-vous en toute simplicité',
      icon: '📅',
      adminOnly: false
    },
    {
      title: 'Gestion des Prestataires',
      description: 'Administrez votre équipe de prestataires efficacement',
      icon: '👥',
      adminOnly: true
    },
    {
      title: 'Disponibilités en Temps Réel',
      description: 'Consultez les créneaux disponibles instantanément',
      icon: '⏰',
      adminOnly: false
    },
    {
      title: 'Paiements Sécurisés',
      description: 'Effectuez vos transactions en toute sécurité',
      icon: '💳',
      adminOnly: false
    },
    {
      title: 'Rapports et Analyses',
      description: 'Analysez vos performances et optimisez votre activité',
      icon: '📊',
      adminOnly: true
    },
    {
      title: 'Notifications Intelligentes',
      description: 'Recevez des alertes personnalisées en temps réel',
      icon: '🔔',
      adminOnly: false
    }
  ];

  testimonials = [
    {
      name: 'Marie Dubois',
      role: 'Esthéticienne',
      content: 'RéservPlus a révolutionné ma façon de gérer mes clients. Plus de double réservation !',
      avatar: '👩‍💼'
    },
    {
      name: 'Jean Martin',
      role: 'Coiffeur',
      content: 'Interface intuitive et fonctionnalités complètes. Je recommande vivement !',
      avatar: '👨‍💼'
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
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.currentUser = state.user;
      this.updateRoleFlags();
    });
    
    this.loadUsers();
  }

  private updateRoleFlags(): void {
    this.isAdmin = this.roleService.isAdmin();
    this.isPrestataire = this.roleService.isPrestataire();
    this.isUser = this.roleService.isUser();
  }

  onGetStarted(): void {
    if (this.isAuthenticated) {
      if (this.isAdmin) {
        this.router.navigate(['/dashboard']);
      } else if (this.isPrestataire) {
        this.router.navigate(['/services']);
      } else {
        // Utilisateur normal - rediriger vers le dashboard
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  onLearnMore(): void {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }

  onContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  onFeatureClick(feature: any): void {
    if (this.isAuthenticated) {
      // Vérifier si la fonctionnalité est réservée aux admins
      if (feature.adminOnly && !this.isAdmin) {
        alert('Cette fonctionnalité est réservée aux administrateurs.');
        return;
      }

      switch (feature.title) {
        case 'Gestion des Réservations':
          this.router.navigate(['/reservations']);
          break;
        case 'Gestion des Prestataires':
          if (this.isAdmin) {
            this.router.navigate(['/prestataires']);
          }
          break;
        case 'Disponibilités en Temps Réel':
          if (this.isPrestataire || this.isAdmin) {
            this.router.navigate(['/disponibilites']);
          } else {
            this.router.navigate(['/dashboard']);
          }
          break;
        case 'Paiements Sécurisés':
          this.router.navigate(['/paiements']);
          break;
        case 'Rapports et Analyses':
          if (this.isAdmin) {
            this.router.navigate(['/reports']);
          }
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
      const roleLabel = this.getRoleLabel(this.currentUser.role);
      return `Bienvenue, ${this.currentUser.prenom} ! (${roleLabel})`;
    }
    return 'Bienvenue sur RéservPlus';
  }

  getSubtitle(): string {
    if (this.isAuthenticated) {
      if (this.isAdmin) {
        return 'Accédez à votre tableau de bord administrateur pour gérer l\'ensemble de la plateforme';
      } else if (this.isPrestataire) {
        return 'Gérez vos services et vos disponibilités';
      } else {
        return 'Découvrez nos services et réservez vos créneaux';
      }
    }
    return 'La solution complète pour gérer vos réservations et optimiser votre planning';
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case ROLES.ADMIN:
        return 'Administrateur';
      case ROLES.PRESTATAIRE:
        return 'Prestataire';
      case ROLES.USER:
        return 'Utilisateur';
      default:
        return role;
    }
  }

  // Filtrer les fonctionnalités selon le rôle
  getVisibleFeatures(): any[] {
    if (this.isAdmin) {
      return this.features; // Admin voit tout
    } else {
      return this.features.filter(feature => !feature.adminOnly);
    }
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