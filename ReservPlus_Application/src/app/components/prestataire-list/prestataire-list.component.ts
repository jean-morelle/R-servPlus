import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prestataire, CreatePrestataireDto, UpdatePrestataireDto } from '../../models/prestataire.model';
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

  constructor(private prestataireService: PrestataireService) { }

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

      return matchesSearch && matchesSpecialite;
    });
  }

  onSearchChange(): void {
    this.filterPrestataires();
  }

  onSpecialiteChange(): void {
    this.filterPrestataires();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSpecialite = '';
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
} 