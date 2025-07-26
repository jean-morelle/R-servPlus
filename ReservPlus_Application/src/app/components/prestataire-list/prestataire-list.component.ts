import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prestataire, CreatePrestataireDto, UpdatePrestataireDto, PrestataireFilters, PrestataireSearchResult, PrestataireStats } from '../../models/prestataire.model';
import { PrestataireService } from '../../services/prestataire.service';
import { PrestataireFormComponent } from '../prestataire-form/prestataire-form.component';

@Component({
  selector: 'app-prestataire-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PrestataireFormComponent],
  templateUrl: './prestataire-list.component.html',
  styleUrls: ['./prestataire-list.component.css']
})
export class PrestataireListComponent implements OnInit {
  prestataires: Prestataire[] = [];
  filteredPrestataires: Prestataire[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedSpecialite = '';
  selectedVille = '';
  minTarif: number | null = null;
  maxTarif: number | null = null;
  showAdvancedFilters = false;
  selectedStatus = '';

  specialites = [
    'Plomberie',
    'Électricité',
    'Jardinage',
    'Ménage',
    'Peinture',
    'Menuiserie',
    'Autre'
  ];

  showForm = false;
  editingPrestataire: Prestataire | null = null;
  formMode: 'create' | 'edit' = 'create';
  successMessage = '';
  errorMessage = '';
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;
  
  // Sorting properties
  selectedSort = 'nom';
  
  // Dropdown properties
  activeDropdown: number | null = null;

  constructor(private prestataireService: PrestataireService) { }

  get totalPrestataires(): number {
    return this.prestataires.length;
  }

  get activePrestataires(): number {
    return this.prestataires.filter(p => p.estActif).length;
  }

  ngOnInit(): void {
    this.loadPrestataires();
  }

  loadPrestataires(): void {
    this.loading = true;
    this.error = '';

    this.prestataireService.getAllPrestataires().subscribe({
      next: (data) => {
        this.prestataires = data;
        this.filteredPrestataires = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des prestataires';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  filterPrestataires(): void {
    this.filteredPrestataires = this.prestataires.filter(prestataire => {
      const matchesSearch = !this.searchTerm || 
        prestataire.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        prestataire.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        prestataire.specialite.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        prestataire.ville.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesSpecialite = !this.selectedSpecialite || 
        prestataire.specialite === this.selectedSpecialite;

      const matchesVille = !this.selectedVille || 
        prestataire.ville.toLowerCase().includes(this.selectedVille.toLowerCase());

      const matchesMinTarif = !this.minTarif || 
        prestataire.tarifHoraire >= this.minTarif;

      const matchesMaxTarif = !this.maxTarif || 
        prestataire.tarifHoraire <= this.maxTarif;

      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'true' && prestataire.estActif) ||
        (this.selectedStatus === 'false' && !prestataire.estActif);

      return matchesSearch && matchesSpecialite && matchesVille && matchesMinTarif && matchesMaxTarif && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.filterPrestataires();
  }

  onSpecialiteChange(): void {
    this.filterPrestataires();
  }

  onVilleChange(): void {
    this.filterPrestataires();
  }

  onTarifChange(): void {
    this.filterPrestataires();
  }

  onStatusChange(): void {
    this.filterPrestataires();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSpecialite = '';
    this.selectedVille = '';
    this.selectedStatus = '';
    this.minTarif = null;
    this.maxTarif = null;
    this.filterPrestataires();
  }

  getStatusClass(estActif: boolean): string {
    return estActif ? 'status-active' : 'status-inactive';
  }

  getStatusText(estActif: boolean): string {
    return estActif ? 'Actif' : 'Inactif';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €/h`;
  }

  // Méthodes pour le formulaire
  showAddForm(): void {
    this.formMode = 'create';
    this.editingPrestataire = null;
    this.showForm = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  showEditForm(prestataire: Prestataire): void {
    this.formMode = 'edit';
    this.editingPrestataire = prestataire;
    this.showForm = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  hideForm(): void {
    this.showForm = false;
    this.editingPrestataire = null;
  }

  onFormSubmit(data: CreatePrestataireDto | UpdatePrestataireDto): void {
    if (this.formMode === 'create') {
      this.prestataireService.createPrestataire(data as CreatePrestataireDto).subscribe({
        next: () => {
          this.successMessage = 'Prestataire ajouté avec succès !';
          this.hideForm();
          this.loadPrestataires();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout du prestataire';
          console.error('Erreur:', err);
        }
      });
    } else {
      if (this.editingPrestataire) {
        this.prestataireService.updatePrestataire(this.editingPrestataire.id, data as UpdatePrestataireDto).subscribe({
          next: () => {
            this.successMessage = 'Prestataire modifié avec succès !';
            this.hideForm();
            this.loadPrestataires();
          },
          error: (err) => {
            this.errorMessage = 'Erreur lors de la modification du prestataire';
            console.error('Erreur:', err);
          }
        });
      }
    }
  }

  onFormCancel(): void {
    this.hideForm();
  }

  // Pagination methods
  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  updatePagination(): void {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  // Sorting methods
  onSortChange(): void {
    this.filterPrestataires();
  }

  // Dropdown methods
  toggleDropdown(event: Event, prestataireId: number): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === prestataireId ? null : prestataireId;
  }

  // Status toggle method
  toggleStatus(prestataire: Prestataire): void {
    const updateData: UpdatePrestataireDto = {
      estActif: !prestataire.estActif
    };

    this.prestataireService.updatePrestataire(prestataire.id, updateData).subscribe({
      next: () => {
        this.successMessage = 'Statut modifié avec succès !';
        this.loadPrestataires();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la modification du statut';
        console.error('Erreur:', err);
      }
    });
  }

  // Action methods
  createReservation(prestataire: Prestataire): void {
    console.log('Créer une réservation pour:', prestataire.nom);
    // Implement navigation to reservation form
  }

  viewDetails(prestataire: Prestataire): void {
    console.log('Voir les détails de:', prestataire.nom);
    // Implement navigation to details page
  }

  deletePrestataire(prestataire: Prestataire): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${prestataire.prenom} ${prestataire.nom} ?`)) {
      this.prestataireService.deletePrestataire(prestataire.id).subscribe({
        next: () => {
          this.successMessage = 'Prestataire supprimé avec succès !';
          this.loadPrestataires();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression du prestataire';
          console.error('Erreur:', err);
        }
      });
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  // Notification methods
  clearSuccessMessage(): void {
    this.successMessage = '';
  }

  clearErrorMessage(): void {
    this.errorMessage = '';
  }

  // Méthodes supplémentaires pour l'interface moderne
  clearSearch(): void {
    this.searchTerm = '';
    this.onSearchChange();
  }

  selectSpecialite(specialite: string): void {
    this.selectedSpecialite = specialite;
    this.onSpecialiteChange();
  }

  // Méthode pour obtenir les statistiques
  getStats(): PrestataireStats {
    return {
      total: this.prestataires.length,
      active: this.prestataires.filter(p => p.estActif).length,
      inactive: this.prestataires.filter(p => !p.estActif).length,
      averageRating: this.prestataires.reduce((acc, p) => acc + (p.noteMoyenne || 0), 0) / this.prestataires.length || 0,
      totalReservations: 0,
      heuresTotal: 0,
      revenusTotal: 0,
      rating: 0,
      reviewCount: 0
    };
  }
} 