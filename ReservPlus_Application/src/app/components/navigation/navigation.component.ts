import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { ROLES, UserRole } from '../../models/auth.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <!-- Logo -->
        <a class="navbar-brand" routerLink="/home">
          <i class="material-icons me-2">event</i>
          RéservPlus
        </a>

        <!-- Bouton toggle pour mobile -->
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menu principal -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <ng-container *ngFor="let item of menuItems">
              <li class="nav-item" *ngIf="item.visible">
                <a 
                  [routerLink]="item.route" 
                  routerLinkActive="active"
                  class="nav-link">
                  <i class="material-icons me-1">{{ item.icon }}</i>
                  {{ item.label }}
                </a>
              </li>
            </ng-container>
          </ul>

          <!-- Menu utilisateur (si authentifié) -->
          <ul class="navbar-nav me-3" *ngIf="isAuthenticated">
            <!-- Notifications (Admin seulement) -->
            <li class="nav-item" *ngIf="isAdmin">
              <a class="nav-link position-relative">
                <i class="material-icons">notifications</i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </a>
            </li>

            <!-- Profil utilisateur -->
            <li class="nav-item dropdown">
              <a 
                class="nav-link dropdown-toggle d-flex align-items-center"
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
                  {{ userInitials }}
                </div>
                <span class="d-none d-md-block">{{ currentUser?.prenom }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <!-- Info utilisateur -->
                <li>
                  <div class="dropdown-item-text">
                    <div class="fw-bold">{{ currentUser?.prenom }} {{ currentUser?.nom }}</div>
                    <small class="text-muted">{{ currentUser?.email }}</small>
                    <div class="small text-primary fw-bold">{{ getRoleLabel(currentUser?.role) }}</div>
                  </div>
                </li>
                <li><hr class="dropdown-divider"></li>
                
                <!-- Actions -->
                <li>
                  <a class="dropdown-item" routerLink="/profile">
                    <i class="material-icons me-2">person</i>
                    Mon Profil
                  </a>
                </li>

                <!-- Paramètres (Admin seulement) -->
                <li *ngIf="isAdmin">
                  <a class="dropdown-item" routerLink="/settings">
                    <i class="material-icons me-2">settings</i>
                    Paramètres
                  </a>
                </li>

                <li><hr class="dropdown-divider"></li>
                
                <li>
                  <button 
                    class="dropdown-item"
                    (click)="logout()">
                    <i class="material-icons me-2">logout</i>
                    Déconnexion
                  </button>
                </li>
              </ul>
            </li>
          </ul>

          <!-- Boutons de connexion/inscription (si non authentifié) -->
          <ul class="navbar-nav" *ngIf="!isAuthenticated">
            <li class="nav-item">
              <a class="nav-link btn btn-outline-primary me-2" routerLink="/login">
                <i class="material-icons me-1">login</i>
                Connexion
              </a>
            </li>
            <li class="nav-item">
              <a class="btn btn-primary" routerLink="/register">
                <i class="material-icons me-1">person_add</i>
                Inscription
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: 700;
      color: #0d6efd !important;
      font-size: 1.5rem;
    }
    
    .nav-link.active {
      color: #0d6efd !important;
      font-weight: 500;
    }
    
    .dropdown-item-text {
      padding: 0.5rem 1rem;
    }
    
    .btn-outline-primary {
      border-color: #0d6efd;
      color: #0d6efd;
    }
    
    .btn-outline-primary:hover {
      background-color: #0d6efd;
      border-color: #0d6efd;
      color: white;
    }
    
    .btn-primary {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    
    .btn-primary:hover {
      background-color: #0b5ed7;
      border-color: #0b5ed7;
    }
  `]
})
export class NavigationComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: any = null;
  menuItems: any[] = [];
  showUserMenu = false;
  isAdmin = false;
  isPrestataire = false;
  isUser = false;

  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    // Forcer l'état non authentifié pour afficher les boutons de connexion
    this.isAuthenticated = false;
    this.currentUser = null;
    
    this.subscription.add(
      this.authService.authState$.subscribe(authState => {
        this.isAuthenticated = authState.isAuthenticated;
        this.currentUser = authState.user;
        this.isAdmin = this.roleService.isAdmin();
        this.isPrestataire = this.roleService.isPrestataire();
        this.isUser = this.roleService.isUser();
        this.updateMenuItems();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get userInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.prenom?.charAt(0) || ''}${this.currentUser.nom?.charAt(0) || ''}`.toUpperCase();
    }
    return 'U';
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
        return 'Utilisateur';
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }

  private updateMenuItems() {
    this.menuItems = [
      { label: 'Accueil', route: '/home', icon: 'home', visible: true },
      { label: 'Fonctionnalités', route: '/features', icon: 'star', visible: true },
      { label: 'À propos', route: '/about', icon: 'info', visible: true },
      { label: 'Contact', route: '/contact', icon: 'contact_support', visible: true },
      
      // Liens pour utilisateurs authentifiés
      { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', visible: this.isAuthenticated },
      { label: 'Mes Réservations', route: '/reservations', icon: 'event', visible: this.isAuthenticated },
      { label: 'Mes Paiements', route: '/paiements', icon: 'payment', visible: this.isAuthenticated },
      
      // Liens pour prestataires et admins
      { label: 'Mes Services', route: '/services', icon: 'business', visible: this.isPrestataire || this.isAdmin },
      { label: 'Disponibilités', route: '/disponibilites', icon: 'schedule', visible: this.isPrestataire || this.isAdmin },
      
      // Liens pour admins uniquement
      { label: 'Utilisateurs', route: '/users', icon: 'people', visible: this.isAdmin },
      { label: 'Prestataires', route: '/prestataires', icon: 'business_center', visible: this.isAdmin },
      { label: 'Rapports', route: '/reports', icon: 'analytics', visible: this.isAdmin },
    ];
  }
} 