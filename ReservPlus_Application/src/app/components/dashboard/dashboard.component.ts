import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { ROLES } from '../../models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <!-- En-tête du dashboard -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h1 class="h2 mb-1">
                    Tableau de bord {{ getRoleLabel() }}
                  </h1>
                  <p class="text-muted mb-0">
                    Bienvenue, {{ currentUser?.prenom }} {{ currentUser?.nom }}
                  </p>
                </div>
                <div class="col-md-4 text-md-end">
                  <p class="text-muted small mb-1">Dernière connexion</p>
                  <p class="fw-medium">{{ getCurrentTime() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-primary bg-opacity-10 rounded-circle p-3">
                    <i class="material-icons text-primary">people</i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="card-title text-muted mb-1">Utilisateurs</h6>
                  <h3 class="mb-0 fw-bold">{{ stats.users }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-success bg-opacity-10 rounded-circle p-3">
                    <i class="material-icons text-success">event</i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="card-title text-muted mb-1">Réservations</h6>
                  <h3 class="mb-0 fw-bold">{{ stats.reservations }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-warning bg-opacity-10 rounded-circle p-3">
                    <i class="material-icons text-warning">business</i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="card-title text-muted mb-1">Prestataires</h6>
                  <h3 class="mb-0 fw-bold">{{ stats.prestataires }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0">
                  <div class="bg-info bg-opacity-10 rounded-circle p-3">
                    <i class="material-icons text-info">euro</i>
                  </div>
                </div>
                <div class="flex-grow-1 ms-3">
                  <h6 class="card-title text-muted mb-1">Revenus</h6>
                  <h3 class="mb-0 fw-bold">{{ stats.revenus }}€</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="row">
        <!-- Actions rapides pour Admin -->
        <div *ngIf="isAdmin" class="col-lg-8 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title mb-0">
                <i class="material-icons me-2">flash_on</i>
                Actions rapides
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <a routerLink="/users" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-primary">people</i>
                        </div>
                        <h6 class="card-title">Gérer les utilisateurs</h6>
                        <p class="card-text text-muted small">Ajouter, modifier, supprimer</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="col-md-6">
                  <a routerLink="/prestataires" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-warning">business</i>
                        </div>
                        <h6 class="card-title">Gérer les prestataires</h6>
                        <p class="card-text text-muted small">Services et disponibilités</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="col-md-6">
                  <a routerLink="/reports" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-success">analytics</i>
                        </div>
                        <h6 class="card-title">Voir les rapports</h6>
                        <p class="card-text text-muted small">Analyses et statistiques</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="col-md-6">
                  <a routerLink="/settings" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-secondary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-secondary">settings</i>
                        </div>
                        <h6 class="card-title">Paramètres</h6>
                        <p class="card-text text-muted small">Configuration système</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides pour Prestataire -->
        <div *ngIf="isPrestataire" class="col-lg-8 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title mb-0">
                <i class="material-icons me-2">flash_on</i>
                Actions rapides
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <a routerLink="/services" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-primary">build</i>
                        </div>
                        <h6 class="card-title">Mes Services</h6>
                        <p class="card-text text-muted small">Gérer mes offres</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="col-md-6">
                  <a routerLink="/disponibilites" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-success">schedule</i>
                        </div>
                        <h6 class="card-title">Disponibilités</h6>
                        <p class="card-text text-muted small">Planifier mes créneaux</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="col-md-6">
                  <a routerLink="/reservations" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-info">event</i>
                        </div>
                        <h6 class="card-title">Mes Réservations</h6>
                        <p class="card-text text-muted small">Voir les demandes</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="col-md-6">
                  <a routerLink="/paiements" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-warning">payment</i>
                        </div>
                        <h6 class="card-title">Paiements</h6>
                        <p class="card-text text-muted small">Suivre mes revenus</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides pour Utilisateur -->
        <div *ngIf="isUser" class="col-lg-8 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title mb-0">
                <i class="material-icons me-2">flash_on</i>
                Actions rapides
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <a routerLink="/reservations" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-primary">event</i>
                        </div>
                        <h6 class="card-title">Mes Réservations</h6>
                        <p class="card-text text-muted small">Voir mes rendez-vous</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="col-md-6">
                  <a routerLink="/paiements" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-success">payment</i>
                        </div>
                        <h6 class="card-title">Mes Paiements</h6>
                        <p class="card-text text-muted small">Historique des transactions</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="col-md-6">
                  <a routerLink="/profile" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-info">person</i>
                        </div>
                        <h6 class="card-title">Mon Profil</h6>
                        <p class="card-text text-muted small">Modifier mes informations</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div class="col-md-6">
                  <a routerLink="/home" class="text-decoration-none">
                    <div class="card border h-100 action-card">
                      <div class="card-body text-center p-4">
                        <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                          <i class="material-icons text-warning">search</i>
                        </div>
                        <h6 class="card-title">Rechercher</h6>
                        <p class="card-text text-muted small">Trouver des services</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Activité récente -->
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title mb-0">
                <i class="material-icons me-2">notifications</i>
                Activité récente
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <div *ngFor="let activity of recentActivity" class="list-group-item border-0 py-3">
                  <div class="d-flex align-items-start">
                    <div class="flex-shrink-0">
                      <div class="bg-light rounded-circle p-2">
                        <i class="material-icons text-muted small">{{ activity.icon }}</i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="mb-1">{{ activity.title }}</h6>
                      <p class="text-muted small mb-1">{{ activity.description }}</p>
                      <small class="text-muted">{{ activity.time }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .action-card {
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
      border-color: #0d6efd !important;
    }
    
    .card {
      transition: box-shadow 0.3s ease;
    }
    
    .card:hover {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  isAdmin = false;
  isPrestataire = false;
  isUser = false;

  stats = {
    users: 156,
    reservations: 342,
    prestataires: 23,
    revenus: 15420
  };

  recentActivity = [
    {
      icon: 'event',
      title: 'Nouvelle réservation',
      description: 'Marie Dubois a réservé un créneau',
      time: 'Il y a 5 min'
    },
    {
      icon: 'payment',
      title: 'Paiement reçu',
      description: 'Paiement de 50€ confirmé',
      time: 'Il y a 1 heure'
    },
    {
      icon: 'person_add',
      title: 'Nouveau prestataire',
      description: 'Jean Martin s\'est inscrit',
      time: 'Il y a 2 heures'
    },
    {
      icon: 'event',
      title: 'Réservation annulée',
      description: 'Sophie Martin a annulé',
      time: 'Il y a 3 heures'
    }
  ];

  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.authService.authState$.subscribe(authState => {
      this.currentUser = authState.user;
      this.updateRoleFlags();
      this.loadStats();
    });
  }

  private updateRoleFlags(): void {
    this.isAdmin = this.roleService.isAdmin();
    this.isPrestataire = this.roleService.isPrestataire();
    this.isUser = this.roleService.isUser();
  }

  private loadStats(): void {
    // Ici vous pouvez charger les vraies statistiques depuis l'API
    // Pour l'instant, on utilise des données statiques
    if (this.isAdmin) {
      this.stats = {
        users: 156,
        reservations: 342,
        prestataires: 23,
        revenus: 15420
      };
    } else if (this.isPrestataire) {
      this.stats = {
        users: 0,
        reservations: 12,
        prestataires: 1,
        revenus: 850
      };
    } else {
      this.stats = {
        users: 0,
        reservations: 3,
        prestataires: 0,
        revenus: 0
      };
    }
  }

  getRoleLabel(): string {
    if (this.isAdmin) return 'Administrateur';
    if (this.isPrestataire) return 'Prestataire';
    if (this.isUser) return 'Utilisateur';
    return '';
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
} 