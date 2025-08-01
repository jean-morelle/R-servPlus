import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { ROLES } from '../../models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <!-- En-tête du profil -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-3 text-center mb-3 mb-md-0">
                  <div class="profile-avatar mx-auto mb-3">
                    <div class="avatar-circle">
                      <span class="avatar-text">{{ getUserInitials() }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-9">
                  <div class="d-flex flex-column">
                    <h1 class="h2 mb-2 text-dark">
                      {{ currentUser?.prenom }} {{ currentUser?.nom }}
                    </h1>
                    <p class="text-muted mb-2">
                      <i class="material-icons me-2" style="font-size: 1rem;">email</i>
                      {{ currentUser?.email }}
                    </p>
                    <div class="d-flex align-items-center gap-3">
                      <span class="badge" [class]="getRoleBadgeClass()">
                        <i class="material-icons me-1" style="font-size: 1rem;">{{ getRoleIcon() }}</i>
                        {{ getRoleLabel() }}
                      </span>
                      <span class="text-muted small">
                        <i class="material-icons me-1" style="font-size: 1rem;">schedule</i>
                        Membre depuis {{ getMemberSince() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Informations personnelles -->
        <div class="col-lg-8 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-primary bg-opacity-10 border-0">
              <h3 class="h5 mb-0 text-primary">
                <i class="material-icons me-2">person</i>
                Informations personnelles
              </h3>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">person_outline</i>
                    Prénom
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="profile.prenom"
                    class="form-control"
                    placeholder="Votre prénom">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">person</i>
                    Nom
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="profile.nom"
                    class="form-control"
                    placeholder="Votre nom">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">email</i>
                    Email
                  </label>
                  <input 
                    type="email" 
                    [(ngModel)]="profile.email"
                    class="form-control"
                    placeholder="votre.email@exemple.com">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">phone</i>
                    Téléphone
                  </label>
                  <input 
                    type="tel" 
                    [(ngModel)]="profile.telephone"
                    class="form-control"
                    placeholder="+33 1 23 45 67 89">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">location_city</i>
                    Ville
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="profile.ville"
                    class="form-control"
                    placeholder="Lomé">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">markunread_mailbox</i>
                    Code postal
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="profile.codePostal"
                    class="form-control"
                    placeholder="00000">
                </div>
              </div>
            </div>
          </div>

          <!-- Section spécifique au rôle -->
          <div *ngIf="isPrestataire" class="card shadow-sm mt-4">
            <div class="card-header bg-success bg-opacity-10 border-0">
              <h3 class="h5 mb-0 text-success">
                <i class="material-icons me-2">business</i>
                Informations prestataire
              </h3>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">work</i>
                    Spécialité
                  </label>
                  <input 
                    type="text" 
                    [(ngModel)]="prestataireInfo.specialite"
                    class="form-control"
                    placeholder="Votre spécialité">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">euro</i>
                    Tarif horaire (€)
                  </label>
                  <input 
                    type="number" 
                    [(ngModel)]="prestataireInfo.tarifHoraire"
                    class="form-control"
                    placeholder="0">
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">description</i>
                    Description
                  </label>
                  <textarea 
                    [(ngModel)]="prestataireInfo.description"
                    rows="4"
                    class="form-control"
                    placeholder="Décrivez vos services et votre expérience..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Sécurité -->
          <div class="card shadow-sm mt-4">
            <div class="card-header bg-warning bg-opacity-10 border-0">
              <h3 class="h5 mb-0 text-warning">
                <i class="material-icons me-2">security</i>
                Sécurité
              </h3>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">lock</i>
                    Nouveau mot de passe
                  </label>
                  <input 
                    type="password" 
                    [(ngModel)]="security.newPassword"
                    class="form-control"
                    placeholder="••••••••">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">
                    <i class="material-icons me-1" style="font-size: 1rem;">lock_outline</i>
                    Confirmer le mot de passe
                  </label>
                  <input 
                    type="password" 
                    [(ngModel)]="security.confirmPassword"
                    class="form-control"
                    placeholder="••••••••">
                </div>
              </div>
              <div class="mt-3">
                <div class="alert alert-info d-flex align-items-center" role="alert">
                  <i class="material-icons me-2">info</i>
                  <small>Laissez vide pour conserver votre mot de passe actuel</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-content-end gap-3 mt-4">
            <button 
              (click)="onCancel()"
              class="btn btn-outline-secondary">
              <i class="material-icons me-1">cancel</i>
              Annuler
            </button>
            <button 
              (click)="onSave()"
              class="btn btn-primary">
              <i class="material-icons me-1">save</i>
              Enregistrer
            </button>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <!-- Statistiques rapides -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-info bg-opacity-10 border-0">
              <h4 class="h6 mb-0 text-info">
                <i class="material-icons me-2">analytics</i>
                Statistiques
              </h4>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-6 mb-3">
                  <div class="stat-item">
                    <div class="stat-number text-primary">{{ stats.reservations }}</div>
                    <div class="stat-label text-muted small">Réservations</div>
                  </div>
                </div>
                <div class="col-6 mb-3">
                  <div class="stat-item">
                    <div class="stat-number text-success">{{ stats.services }}</div>
                    <div class="stat-label text-muted small">Services</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-item">
                    <div class="stat-number text-warning">{{ stats.rating }}</div>
                    <div class="stat-label text-muted small">Note</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-item">
                    <div class="stat-number text-info">{{ stats.experience }}</div>
                    <div class="stat-label text-muted small">Expérience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary bg-opacity-10 border-0">
              <h4 class="h6 mb-0 text-primary">
                <i class="material-icons me-2">flash_on</i>
                Actions rapides
              </h4>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                  <i class="material-icons me-3 text-primary">dashboard</i>
                  <div>
                    <div class="fw-medium">Tableau de bord</div>
                    <small class="text-muted">Voir vos statistiques</small>
                  </div>
                </a>
                <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                  <i class="material-icons me-3 text-success">event</i>
                  <div>
                    <div class="fw-medium">Mes réservations</div>
                    <small class="text-muted">Gérer vos rendez-vous</small>
                  </div>
                </a>
                <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                  <i class="material-icons me-3 text-warning">payment</i>
                  <div>
                    <div class="fw-medium">Paiements</div>
                    <small class="text-muted">Historique des transactions</small>
                  </div>
                </a>
                <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                  <i class="material-icons me-3 text-info">settings</i>
                  <div>
                    <div class="fw-medium">Paramètres</div>
                    <small class="text-muted">Configurer votre compte</small>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- Informations de sécurité -->
          <div class="card shadow-sm">
            <div class="card-header bg-warning bg-opacity-10 border-0">
              <h4 class="h6 mb-0 text-warning">
                <i class="material-icons me-2">verified_user</i>
                Sécurité
              </h4>
            </div>
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <i class="material-icons text-success me-2">check_circle</i>
                <div>
                  <div class="fw-medium">Authentification à 2 facteurs</div>
                  <small class="text-muted">Activée</small>
                </div>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="material-icons text-success me-2">check_circle</i>
                <div>
                  <div class="fw-medium">Dernière connexion</div>
                  <small class="text-muted">{{ getLastLogin() }}</small>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <i class="material-icons text-info me-2">info</i>
                <div>
                  <div class="fw-medium">Statut du compte</div>
                  <small class="text-muted">Vérifié</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-avatar {
      width: 120px;
      height: 120px;
    }
    
    .avatar-circle {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2.5rem;
      font-weight: bold;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .stat-item {
      padding: 1rem 0;
    }
    
    .stat-number {
      font-size: 1.5rem;
      font-weight: bold;
      display: block;
    }
    
    .stat-label {
      font-size: 0.875rem;
    }
    
    .list-group-item {
      border: none;
      padding: 1rem;
      transition: all 0.3s ease;
    }
    
    .list-group-item:hover {
      background-color: #f8f9fa;
      transform: translateX(5px);
    }
    
    .card {
      transition: all 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
    
    .form-control:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
    
    .btn {
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      transform: translateY(-1px);
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  isAdmin = false;
  isPrestataire = false;
  isUser = false;

  profile = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    ville: '',
    codePostal: ''
  };

  prestataireInfo = {
    specialite: '',
    tarifHoraire: 0,
    description: ''
  };

  security = {
    newPassword: '',
    confirmPassword: ''
  };

  stats = {
    reservations: 12,
    services: 5,
    rating: '4.8',
    experience: '2 ans'
  };

  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.authService.authState$.subscribe(state => {
      this.currentUser = state.user;
      this.updateRoleFlags();
      this.loadProfileData();
    });
  }

  private updateRoleFlags(): void {
    this.isAdmin = this.roleService.isAdmin();
    this.isPrestataire = this.roleService.isPrestataire();
    this.isUser = this.roleService.isUser();
  }

  private loadProfileData(): void {
    if (this.currentUser) {
      this.profile = {
        prenom: this.currentUser.prenom || '',
        nom: this.currentUser.nom || '',
        email: this.currentUser.email || '',
        telephone: this.currentUser.telephone || '',
        ville: this.currentUser.ville || '',
        codePostal: this.currentUser.codePostal || ''
      };
    }
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.prenom?.charAt(0) || ''}${this.currentUser.nom?.charAt(0) || ''}`.toUpperCase();
  }

  getRoleLabel(): string {
    if (this.isAdmin) return 'Administrateur';
    if (this.isPrestataire) return 'Prestataire';
    if (this.isUser) return 'Utilisateur';
    return '';
  }

  getRoleIcon(): string {
    if (this.isAdmin) return 'admin_panel_settings';
    if (this.isPrestataire) return 'business';
    if (this.isUser) return 'person';
    return 'person';
  }

  getRoleBadgeClass(): string {
    if (this.isAdmin) return 'bg-danger';
    if (this.isPrestataire) return 'bg-success';
    if (this.isUser) return 'bg-primary';
    return 'bg-secondary';
  }

  getMemberSince(): string {
    return 'Janvier 2024';
  }

  getLastLogin(): string {
    return 'Il y a 2 heures';
  }

  onSave(): void {
    // Logique de sauvegarde
    console.log('Sauvegarde du profil:', this.profile);
    if (this.isPrestataire) {
      console.log('Informations prestataire:', this.prestataireInfo);
    }
    if (this.security.newPassword) {
      console.log('Changement de mot de passe');
    }
    
    // Simulation d'une sauvegarde réussie
    alert('Profil mis à jour avec succès !');
  }

  onCancel(): void {
    this.loadProfileData();
    this.security = {
      newPassword: '',
      confirmPassword: ''
    };
  }
} 