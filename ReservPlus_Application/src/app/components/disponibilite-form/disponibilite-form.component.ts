import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Disponibilite } from '../../models/disponibilite.model';
import { DisponibiliteService } from '../../services/disponibilite.service';
import { PrestataireService } from '../../services/prestataire.service';
import { Prestataire } from '../../models/prestataire.model';

@Component({
  selector: 'app-disponibilite-form',
  templateUrl: './disponibilite-form.component.html',
  styleUrls: ['./disponibilite-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DisponibiliteFormComponent implements OnInit {
  @Input() disponibilite: Disponibilite | null = null;
  @Input() isEditMode: boolean = false;
  @Output() saved = new EventEmitter<Disponibilite>();
  @Output() cancelled = new EventEmitter<void>();

  disponibiliteForm: FormGroup;
  prestataires: Prestataire[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private disponibiliteService: DisponibiliteService,
    private prestataireService: PrestataireService
  ) {
    this.disponibiliteForm = this.fb.group({
      prestataireId: ['', Validators.required],
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      disponible: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPrestataires();
    if (this.disponibilite && this.isEditMode) {
      this.populateForm();
    }
  }

  loadPrestataires(): void {
    this.prestataireService.getAllPrestataires().subscribe({
      next: (prestataires) => {
        this.prestataires = prestataires;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prestataires:', error);
        this.errorMessage = 'Erreur lors du chargement des prestataires';
      }
    });
  }

  populateForm(): void {
    if (this.disponibilite) {
      this.disponibiliteForm.patchValue({
        prestataireId: this.disponibilite.prestataireId,
        date: this.formatDateForInput(this.disponibilite.date.toString()),
        heureDebut: this.formatTimeForInput(this.disponibilite.heureDebut),
        heureFin: this.formatTimeForInput(this.disponibilite.heureFin),
        disponible: this.disponibilite.estDisponible
      });
    }
  }

  formatDateForInput(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  formatTimeForInput(time: string): string {
    return time.substring(0, 5); // Format HH:mm
  }

  onSubmit(): void {
    if (this.disponibiliteForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formValue = this.disponibiliteForm.value;
      
      // Ensure required fields are present
      if (!formValue.prestataireId) {
        this.errorMessage = 'Prestataire est requis';
        this.loading = false;
        return;
      }

      const disponibiliteData: Partial<Disponibilite> = {
        prestataireId: formValue.prestataireId,
        date: formValue.date,
        heureDebut: formValue.heureDebut,
        heureFin: formValue.heureFin,
        estDisponible: formValue.disponible
      };

      if (this.isEditMode && this.disponibilite) {
        this.disponibiliteService.updateDisponibilite(this.disponibilite.id, disponibiliteData).subscribe({
          next: (updatedDisponibilite) => {
            this.loading = false;
            this.saved.emit(updatedDisponibilite);
          },
          error: (error) => {
            this.loading = false;
            console.error('Erreur lors de la mise à jour:', error);
            this.errorMessage = 'Erreur lors de la mise à jour de la disponibilité';
          }
        });
      } else {
        this.disponibiliteService.createDisponibilite(disponibiliteData as any).subscribe({
          next: (newDisponibilite) => {
            this.loading = false;
            this.saved.emit(newDisponibilite);
          },
          error: (error) => {
            this.loading = false;
            console.error('Erreur lors de la création:', error);
            this.errorMessage = 'Erreur lors de la création de la disponibilité';
          }
        });
      }
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.disponibiliteForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} est requis`;
      }
    }
    return '';
  }

  getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      prestataireId: 'Prestataire',
      date: 'Date',
      heureDebut: 'Heure de début',
      heureFin: 'Heure de fin',
      disponible: 'Disponible'
    };
    return fieldNames[fieldName] || fieldName;
  }
} 