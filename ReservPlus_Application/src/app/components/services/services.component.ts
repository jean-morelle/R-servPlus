import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <!-- En-tête -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex align-items-center mb-3">
            <div class="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
              <i class="material-icons text-primary">build</i>
            </div>
            <div>
              <h1 class="h2 mb-1">Mes Services</h1>
              <p class="text-muted mb-0">Gérez vos services et tarifs</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton Ajouter -->
      <div class="row mb-4">
        <div class="col-12">
          <button 
            (click)="showAddForm = true"
            class="btn btn-primary">
            <i class="material-icons me-2">add</i>
            Ajouter un service
          </button>
        </div>
      </div>

      <!-- Formulaire d'ajout -->
      <div *ngIf="showAddForm" class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title mb-0">
                <i class="material-icons me-2">{{ editingService ? 'edit' : 'add' }}</i>
                {{ editingService ? 'Modifier le service' : 'Nouveau service' }}
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Nom du service *</label>
                  <input 
                    type="text" 
                    [(ngModel)]="newService.nom"
                    class="form-control"
                    placeholder="Ex: Coupe et brushing">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Catégorie *</label>
                  <select 
                    [(ngModel)]="newService.categorie"
                    class="form-select">
                    <option value="">Sélectionner une catégorie</option>
                    <option value="coiffure">Coiffure</option>
                    <option value="massage">Massage</option>
                    <option value="manucure">Manucure</option>
                    <option value="maquillage">Maquillage</option>
                    <option value="soin">Soin</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Prix (€) *</label>
                  <input 
                    type="number" 
                    [(ngModel)]="newService.prix"
                    class="form-control"
                    min="0"
                    step="0.01"
                    placeholder="0.00">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Durée (minutes) *</label>
                  <input 
                    type="number" 
                    [(ngModel)]="newService.duree"
                    class="form-control"
                    min="15"
                    step="15"
                    placeholder="60">
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium">Description</label>
                  <textarea 
                    [(ngModel)]="newService.description"
                    rows="3"
                    class="form-control"
                    placeholder="Décrivez votre service..."></textarea>
                </div>
              </div>
              <div class="d-flex justify-content-end gap-3 mt-4">
                <button 
                  (click)="cancelForm()"
                  class="btn btn-outline-secondary">
                  <i class="material-icons me-2">close</i>
                  Annuler
                </button>
                <button 
                  (click)="saveService()"
                  class="btn btn-primary">
                  <i class="material-icons me-2">{{ editingService ? 'save' : 'add' }}</i>
                  {{ editingService ? 'Modifier' : 'Ajouter' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i class="material-icons text-primary">build</i>
              </div>
              <h4 class="mb-1">{{ services.length }}</h4>
              <p class="text-muted mb-0">Services totaux</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i class="material-icons text-success">check_circle</i>
              </div>
              <h4 class="mb-1">{{ getActiveServicesCount() }}</h4>
              <p class="text-muted mb-0">Services actifs</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i class="material-icons text-warning">euro</i>
              </div>
              <h4 class="mb-1">{{ getAveragePrice() }}€</h4>
              <p class="text-muted mb-0">Prix moyen</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i class="material-icons text-info">schedule</i>
              </div>
              <h4 class="mb-1">{{ getAverageDuration() }}min</h4>
              <p class="text-muted mb-0">Durée moyenne</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des services -->
      <div class="row" *ngIf="services.length > 0">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title mb-0">
                <i class="material-icons me-2">list</i>
                Liste des services
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Service</th>
                      <th>Catégorie</th>
                      <th>Prix</th>
                      <th>Durée</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let service of services; trackBy: trackByService">
                      <td>
                        <div>
                          <h6 class="mb-1">{{ service.nom }}</h6>
                          <small class="text-muted">{{ service.description }}</small>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-secondary">{{ getCategoryLabel(service.categorie) }}</span>
                      </td>
                      <td>
                        <span class="fw-bold text-primary">{{ service.prix }}€</span>
                      </td>
                      <td>
                        <span class="text-muted">{{ service.duree }} min</span>
                      </td>
                      <td>
                        <span class="badge" 
                              [class]="service.actif ? 'bg-success' : 'bg-danger'">
                          {{ service.actif ? 'Actif' : 'Inactif' }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button 
                            (click)="editService(service)"
                            class="btn btn-outline-primary"
                            title="Modifier">
                            <i class="material-icons">edit</i>
                          </button>
                          <button 
                            (click)="toggleServiceStatus(service)"
                            class="btn btn-outline-warning"
                            [title]="service.actif ? 'Désactiver' : 'Activer'">
                            <i class="material-icons">{{ service.actif ? 'pause' : 'play_arrow' }}</i>
                          </button>
                          <button 
                            (click)="deleteService(service.id)"
                            class="btn btn-outline-danger"
                            title="Supprimer">
                            <i class="material-icons">delete</i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun service -->
      <div *ngIf="services.length === 0" class="row">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center py-5">
              <div class="bg-light rounded-circle d-inline-flex p-4 mb-4">
                <i class="material-icons text-muted" style="font-size: 3rem;">build</i>
              </div>
              <h3 class="h5 mb-2">Aucun service</h3>
              <p class="text-muted mb-4">Commencez par ajouter votre premier service pour proposer vos prestations.</p>
              <button 
                (click)="showAddForm = true"
                class="btn btn-primary">
                <i class="material-icons me-2">add</i>
                Ajouter un service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th {
      border-top: none;
      font-weight: 600;
      color: #495057;
    }
    
    .table td {
      vertical-align: middle;
    }
    
    .btn-group .btn {
      border-radius: 0.375rem !important;
    }
    
    .btn-group .btn:first-child {
      border-top-left-radius: 0.375rem !important;
      border-bottom-left-radius: 0.375rem !important;
    }
    
    .btn-group .btn:last-child {
      border-top-right-radius: 0.375rem !important;
      border-bottom-right-radius: 0.375rem !important;
    }
    
    .card {
      transition: box-shadow 0.3s ease;
    }
    
    .card:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
    
    .form-control:focus,
    .form-select:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
  `]
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  showAddForm = false;
  editingService: any = null;

  newService = {
    nom: '',
    categorie: '',
    prix: 0,
    duree: 60,
    description: '',
    actif: true
  };

  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    // Vérifier que l'utilisateur est prestataire ou admin
    if (!this.roleService.isPrestataire() && !this.roleService.isAdmin()) {
      console.error('Accès refusé : Seuls les prestataires peuvent gérer les services');
      return;
    }

    this.loadServices();
  }

  private loadServices(): void {
    // Simuler le chargement des services
    this.services = [
      {
        id: 1,
        nom: 'Coupe et brushing',
        categorie: 'coiffure',
        prix: 45,
        duree: 60,
        description: 'Coupe personnalisée avec brushing professionnel',
        actif: true
      },
      {
        id: 2,
        nom: 'Massage relaxant',
        categorie: 'massage',
        prix: 80,
        duree: 90,
        description: 'Massage relaxant du corps entier',
        actif: true
      },
      {
        id: 3,
        nom: 'Manucure classique',
        categorie: 'manucure',
        prix: 25,
        duree: 45,
        description: 'Soin complet des mains et pose de vernis',
        actif: false
      },
      {
        id: 4,
        nom: 'Maquillage de soirée',
        categorie: 'maquillage',
        prix: 35,
        duree: 75,
        description: 'Maquillage professionnel pour événements',
        actif: true
      }
    ];
  }

  saveService(): void {
    if (!this.newService.nom || !this.newService.categorie || this.newService.prix <= 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.editingService) {
      // Modifier le service existant
      const index = this.services.findIndex(s => s.id === this.editingService.id);
      if (index !== -1) {
        this.services[index] = { ...this.editingService, ...this.newService };
      }
    } else {
      // Ajouter un nouveau service
      const service = {
        id: Date.now(),
        ...this.newService
      };
      this.services.push(service);
    }

    this.resetForm();
    this.showAddForm = false;
  }

  editService(service: any): void {
    this.editingService = { ...service };
    this.newService = { ...service };
    this.showAddForm = true;
  }

  deleteService(serviceId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.services = this.services.filter(s => s.id !== serviceId);
    }
  }

  toggleServiceStatus(service: any): void {
    service.actif = !service.actif;
  }

  cancelForm(): void {
    this.resetForm();
    this.showAddForm = false;
  }

  resetForm(): void {
    this.newService = {
      nom: '',
      categorie: '',
      prix: 0,
      duree: 60,
      description: '',
      actif: true
    };
    this.editingService = null;
  }

  getCategoryLabel(category: string): string {
    const categories: { [key: string]: string } = {
      'coiffure': 'Coiffure',
      'massage': 'Massage',
      'manucure': 'Manucure',
      'maquillage': 'Maquillage',
      'soin': 'Soin',
      'autre': 'Autre'
    };
    return categories[category] || category;
  }

  getActiveServicesCount(): number {
    return this.services.filter(s => s.actif).length;
  }

  getAveragePrice(): number {
    if (this.services.length === 0) return 0;
    const total = this.services.reduce((sum, service) => sum + service.prix, 0);
    return Math.round(total / this.services.length);
  }

  getAverageDuration(): number {
    if (this.services.length === 0) return 0;
    const total = this.services.reduce((sum, service) => sum + service.duree, 0);
    return Math.round(total / this.services.length);
  }

  trackByService(index: number, service: any): number {
    return service.id;
  }
} 