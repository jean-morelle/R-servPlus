import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Disponibilite } from '../../models/disponibilite.model';
import { DisponibiliteService } from '../../services/disponibilite.service';
import { PrestataireService } from '../../services/prestataire.service';
import { Prestataire } from '../../models/prestataire.model';
import { DisponibiliteFormComponent } from '../disponibilite-form/disponibilite-form.component';

@Component({
  selector: 'app-disponibilite-list',
  templateUrl: './disponibilite-list.component.html',
  styleUrls: ['./disponibilite-list.component.css'],
  standalone: true,
  imports: [CommonModule, DisponibiliteFormComponent]
})
export class DisponibiliteListComponent implements OnInit {
  disponibilites: Disponibilite[] = [];
  prestataires: Prestataire[] = [];
  loading = false;
  errorMessage = '';
  showForm = false;
  selectedDisponibilite: Disponibilite | null = null;
  isEditMode = false;

  constructor(
    private disponibiliteService: DisponibiliteService,
    private prestataireService: PrestataireService
  ) {}

  ngOnInit(): void {
    this.loadDisponibilites();
    this.loadPrestataires();
  }

  loadDisponibilites(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.disponibiliteService.getAllDisponibilites().subscribe({
      next: (disponibilites) => {
        this.disponibilites = disponibilites;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des disponibilités:', error);
        this.errorMessage = 'Erreur lors du chargement des disponibilités';
        this.loading = false;
      }
    });
  }

  loadPrestataires(): void {
    this.prestataireService.getAllPrestataires().subscribe({
      next: (prestataires) => {
        this.prestataires = prestataires;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prestataires:', error);
      }
    });
  }

  getPrestataireName(prestataireId: number): string {
    const prestataire = this.prestataires.find(p => p.id === prestataireId);
    return prestataire ? `${prestataire.nom} ${prestataire.prenom}` : 'Inconnu';
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR');
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  addDisponibilite(): void {
    this.selectedDisponibilite = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  editDisponibilite(disponibilite: Disponibilite): void {
    this.selectedDisponibilite = { ...disponibilite };
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteDisponibilite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette disponibilité ?')) {
      this.disponibiliteService.deleteDisponibilite(id).subscribe({
        next: () => {
          this.loadDisponibilites();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.errorMessage = 'Erreur lors de la suppression de la disponibilité';
        }
      });
    }
  }

  onDisponibiliteSaved(disponibilite: Disponibilite): void {
    this.showForm = false;
    this.selectedDisponibilite = null;
    this.loadDisponibilites();
  }

  onFormCancelled(): void {
    this.showForm = false;
    this.selectedDisponibilite = null;
  }

  getStatusClass(disponible: boolean): string {
    return disponible ? 'status-available' : 'status-unavailable';
  }

  getStatusText(disponible: boolean): string {
    return disponible ? 'Disponible' : 'Indisponible';
  }
} 