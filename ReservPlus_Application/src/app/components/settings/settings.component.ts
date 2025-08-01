import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <!-- En-tête -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex align-items-center mb-3">
            <div class="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
              <i class="material-icons text-primary">settings</i>
            </div>
            <div>
              <h1 class="h2 mb-1">Paramètres système</h1>
              <p class="text-muted mb-0">Configurez les paramètres de votre application RéservPlus</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
              <ul class="nav nav-tabs nav-fill" id="settingsTabs" role="tablist">
                <li class="nav-item" role="presentation" *ngFor="let tab of tabs">
                  <button 
                    class="nav-link"
                    [class.active]="activeTab === tab.id"
                    (click)="activeTab = tab.id"
                    type="button"
                    role="tab">
                    <i class="material-icons me-2">{{ tab.icon }}</i>
                    {{ tab.label }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div class="row">
        <div class="col-12">
          <div [ngSwitch]="activeTab">
            
            <!-- Paramètres généraux -->
            <div *ngSwitchCase="'general'" class="tab-content">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-transparent border-0">
                  <h5 class="card-title mb-0">
                    <i class="material-icons me-2">business</i>
                    Paramètres généraux
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Nom de l'application</label>
                      <input 
                        type="text" 
                        [(ngModel)]="general.appName"
                        class="form-control"
                        placeholder="RéservPlus">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">URL de l'application</label>
                      <input 
                        type="url" 
                        [(ngModel)]="general.appUrl"
                        class="form-control"
                        placeholder="https://reservplus.com">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Email de contact</label>
                      <input 
                        type="email" 
                        [(ngModel)]="general.contactEmail"
                        class="form-control"
                        placeholder="contact&#64;reservplus.com">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Téléphone de contact</label>
                      <input 
                        type="tel" 
                        [(ngModel)]="general.contactPhone"
                        class="form-control"
                        placeholder="+33 1 23 45 67 89">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paramètres de réservation -->
            <div *ngSwitchCase="'reservations'" class="tab-content">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-transparent border-0">
                  <h5 class="card-title mb-0">
                    <i class="material-icons me-2">event</i>
                    Paramètres de réservation
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Délai minimum de réservation (heures)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="reservations.minAdvanceHours"
                        class="form-control"
                        min="0"
                        max="168">
                      <div class="form-text">Délai minimum avant une réservation</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Durée maximale de réservation (heures)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="reservations.maxDurationHours"
                        class="form-control"
                        min="1"
                        max="24">
                      <div class="form-text">Durée maximale d'une réservation</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Annulation gratuite (heures avant)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="reservations.freeCancellationHours"
                        class="form-control"
                        min="0"
                        max="168">
                      <div class="form-text">Délai pour annulation gratuite</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Frais d'annulation (%)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="reservations.cancellationFee"
                        class="form-control"
                        min="0"
                        max="100">
                      <div class="form-text">Pourcentage retenu en cas d'annulation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paramètres de notification -->
            <div *ngSwitchCase="'notifications'" class="tab-content">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-transparent border-0">
                  <h5 class="card-title mb-0">
                    <i class="material-icons me-2">notifications</i>
                    Paramètres de notification
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row g-4">
                    <div class="col-12">
                      <div class="d-flex align-items-center justify-content-between p-3 border rounded">
                        <div class="d-flex align-items-center">
                          <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i class="material-icons text-primary">email</i>
                          </div>
                          <div>
                            <h6 class="mb-1">Notifications par email</h6>
                            <p class="text-muted mb-0 small">Envoyer des notifications par email</p>
                          </div>
                        </div>
                        <div class="form-check form-switch">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            [(ngModel)]="notifications.emailEnabled"
                            id="emailNotifications">
                          <label class="form-check-label" for="emailNotifications"></label>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-12">
                      <div class="d-flex align-items-center justify-content-between p-3 border rounded">
                        <div class="d-flex align-items-center">
                          <div class="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                            <i class="material-icons text-success">notifications_active</i>
                          </div>
                          <div>
                            <h6 class="mb-1">Notifications push</h6>
                            <p class="text-muted mb-0 small">Envoyer des notifications push</p>
                          </div>
                        </div>
                        <div class="form-check form-switch">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            [(ngModel)]="notifications.pushEnabled"
                            id="pushNotifications">
                          <label class="form-check-label" for="pushNotifications"></label>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-12">
                      <div class="d-flex align-items-center justify-content-between p-3 border rounded">
                        <div class="d-flex align-items-center">
                          <div class="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                            <i class="material-icons text-warning">sms</i>
                          </div>
                          <div>
                            <h6 class="mb-1">Notifications SMS</h6>
                            <p class="text-muted mb-0 small">Envoyer des notifications par SMS</p>
                          </div>
                        </div>
                        <div class="form-check form-switch">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            [(ngModel)]="notifications.smsEnabled"
                            id="smsNotifications">
                          <label class="form-check-label" for="smsNotifications"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paramètres de paiement -->
            <div *ngSwitchCase="'payments'" class="tab-content">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-transparent border-0">
                  <h5 class="card-title mb-0">
                    <i class="material-icons me-2">payment</i>
                    Paramètres de paiement
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Devise par défaut</label>
                      <select 
                        [(ngModel)]="payments.defaultCurrency"
                        class="form-select">
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar US ($)</option>
                        <option value="GBP">Livre sterling (£)</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Commission (%)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="payments.commissionRate"
                        class="form-control"
                        min="0"
                        max="50"
                        step="0.1">
                      <div class="form-text">Commission prélevée sur chaque transaction</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Délai de paiement (jours)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="payments.paymentDelay"
                        class="form-control"
                        min="1"
                        max="30">
                      <div class="form-text">Délai avant versement aux prestataires</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Montant minimum de paiement</label>
                      <input 
                        type="number" 
                        [(ngModel)]="payments.minPaymentAmount"
                        class="form-control"
                        min="0"
                        step="0.01">
                      <div class="form-text">Montant minimum pour déclencher un versement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sécurité -->
            <div *ngSwitchCase="'security'" class="tab-content">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-transparent border-0">
                  <h5 class="card-title mb-0">
                    <i class="material-icons me-2">security</i>
                    Paramètres de sécurité
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Durée de session (minutes)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="security.sessionTimeout"
                        class="form-control"
                        min="15"
                        max="480">
                      <div class="form-text">Durée avant déconnexion automatique</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Tentatives de connexion max</label>
                      <input 
                        type="number" 
                        [(ngModel)]="security.maxLoginAttempts"
                        class="form-control"
                        min="3"
                        max="10">
                      <div class="form-text">Nombre de tentatives avant blocage</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Durée de blocage (minutes)</label>
                      <input 
                        type="number" 
                        [(ngModel)]="security.lockoutDuration"
                        class="form-control"
                        min="5"
                        max="1440">
                      <div class="form-text">Durée du blocage après échecs</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Complexité du mot de passe</label>
                      <select 
                        [(ngModel)]="security.passwordComplexity"
                        class="form-select">
                        <option value="low">Faible (6 caractères)</option>
                        <option value="medium">Moyenne (8 caractères + chiffres)</option>
                        <option value="high">Élevée (10 caractères + chiffres + symboles)</option>
                      </select>
                      <div class="form-text">Niveau de complexité requis</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="d-flex justify-content-end gap-3">
            <button 
              (click)="onReset()"
              class="btn btn-outline-secondary">
              <i class="material-icons me-2">refresh</i>
              Réinitialiser
            </button>
            <button 
              (click)="onSave()"
              class="btn btn-primary">
              <i class="material-icons me-2">save</i>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nav-tabs .nav-link {
      border: none;
      border-bottom: 2px solid transparent;
      color: #6c757d;
      font-weight: 500;
      padding: 1rem 1.5rem;
      transition: all 0.3s ease;
    }
    
    .nav-tabs .nav-link:hover {
      border-bottom-color: #dee2e6;
      color: #495057;
    }
    
    .nav-tabs .nav-link.active {
      border-bottom-color: #0d6efd;
      color: #0d6efd;
      background-color: transparent;
    }
    
    .tab-content {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .form-control:focus,
    .form-select:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
    
    .form-check-input:checked {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    
    .card {
      transition: box-shadow 0.3s ease;
    }
    
    .card:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
  `]
})
export class SettingsComponent implements OnInit {
  activeTab = 'general';

  tabs = [
    { id: 'general', label: 'Général', icon: 'business' },
    { id: 'reservations', label: 'Réservations', icon: 'event' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'payments', label: 'Paiements', icon: 'payment' },
    { id: 'security', label: 'Sécurité', icon: 'security' }
  ];

  general = {
    appName: 'RéservPlus',
    appUrl: 'https://reservplus.com',
    contactEmail: 'contact@reservplus.com',
    contactPhone: '+33 1 23 45 67 89'
  };

  reservations = {
    minAdvanceHours: 24,
    maxDurationHours: 8,
    freeCancellationHours: 48,
    cancellationFee: 10
  };

  notifications = {
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false
  };

  payments = {
    defaultCurrency: 'EUR',
    commissionRate: 5,
    paymentDelay: 7,
    minPaymentAmount: 10
  };

  security = {
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    passwordComplexity: 'medium'
  };

  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    // Vérifier que l'utilisateur est administrateur
    if (!this.roleService.isAdmin()) {
      console.error('Accès refusé : Seuls les administrateurs peuvent accéder aux paramètres');
    }
  }

  onSave(): void {
    console.log('Sauvegarde des paramètres:', {
      general: this.general,
      reservations: this.reservations,
      notifications: this.notifications,
      payments: this.payments,
      security: this.security
    });
    
    // Ici vous pouvez ajouter la logique pour sauvegarder les paramètres
    // Par exemple, appeler un service API
  }

  onReset(): void {
    // Réinitialiser tous les paramètres
    this.general = {
      appName: 'RéservPlus',
      appUrl: 'https://reservplus.com',
      contactEmail: 'contact@reservplus.com',
      contactPhone: '+33 1 23 45 67 89'
    };

    this.reservations = {
      minAdvanceHours: 24,
      maxDurationHours: 8,
      freeCancellationHours: 48,
      cancellationFee: 10
    };

    this.notifications = {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false
    };

    this.payments = {
      defaultCurrency: 'EUR',
      commissionRate: 5,
      paymentDelay: 7,
      minPaymentAmount: 10
    };

    this.security = {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      passwordComplexity: 'medium'
    };
  }
} 