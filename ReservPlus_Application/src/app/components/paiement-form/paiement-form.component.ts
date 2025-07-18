import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paiement, MethodePaiement, StatutPaiement } from '../../models/paiement.model';
import { PaiementService } from '../../services/paiement.service';
import { UserService } from '../../services/user.service';
import { PrestataireService } from '../../services/prestataire.service';
import { User } from '../../models/user.model';
import { Prestataire } from '../../models/prestataire.model';

@Component({
  selector: 'app-paiement-form',
  templateUrl: './paiement-form.component.html',
  styleUrls: ['./paiement-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PaiementFormComponent implements OnInit {
  @Input() paiement: Paiement | null = null;
  @Input() isEditMode: boolean = false;
  @Output() saved = new EventEmitter<Paiement>();
  @Output() cancelled = new EventEmitter<void>();

  paiementForm: FormGroup;
  users: User[] = [];
  prestataires: Prestataire[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private paiementService: PaiementService,
    private userService: UserService,
    private prestataireService: PrestataireService
  ) {
    this.paiementForm = this.fb.group({
      userId: ['', Validators.required],
      prestataireId: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0.01)]],
      datePaiement: ['', Validators.required],
      methodePaiement: ['', Validators.required],
      statut: ['En attente', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadPrestataires();
    if (this.paiement && this.isEditMode) {
      this.populateForm();
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
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

  populateForm(): void {
    if (this.paiement) {
      this.paiementForm.patchValue({
        userId: this.paiement.userId,
        prestataireId: this.paiement.prestataireId,
        montant: this.paiement.montant,
        datePaiement: this.formatDateForInput(this.paiement.datePaiement),
        methodePaiement: this.paiement.methodePaiement,
        statut: this.paiement.statut
      });
    }
  }

  formatDateForInput(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.paiementForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formValue = this.paiementForm.value;
      
      // Ensure required fields are present
      if (!formValue.montant) {
        this.errorMessage = 'Montant est requis';
        this.loading = false;
        return;
      }

      let datePaiement: Date | undefined = undefined;
      if (formValue.datePaiement) {
        datePaiement = new Date(formValue.datePaiement);
      } else if (this.paiement && this.paiement.datePaiement) {
        datePaiement = new Date(this.paiement.datePaiement);
      }

      const paiementData: Partial<Paiement> = {
        montant: formValue.montant,
        datePaiement: datePaiement,
        methodePaiement: formValue.methodePaiement,
        statut: formValue.statut
      };

      if (this.isEditMode && this.paiement) {
        this.paiementService.updatePaiement(this.paiement.id, paiementData).subscribe({
          next: (updatedPaiement) => {
            this.loading = false;
            this.saved.emit(updatedPaiement);
          },
          error: (error) => {
            this.loading = false;
            console.error('Erreur lors de la mise à jour:', error);
            this.errorMessage = 'Erreur lors de la mise à jour du paiement';
          }
        });
      } else {
        this.paiementService.createPaiement(paiementData as any).subscribe({
          next: (newPaiement) => {
            this.loading = false;
            this.saved.emit(newPaiement);
          },
          error: (error) => {
            this.loading = false;
            console.error('Erreur lors de la création:', error);
            this.errorMessage = 'Erreur lors de la création du paiement';
          }
        });
      }
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.paiementForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} est requis`;
      }
      if (field.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} doit être supérieur à 0`;
      }
    }
    return '';
  }

  getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      userId: 'Utilisateur',
      prestataireId: 'Prestataire',
      montant: 'Montant',
      datePaiement: 'Date de paiement',
      methodePaiement: 'Méthode de paiement',
      statut: 'Statut'
    };
    return fieldNames[fieldName] || fieldName;
  }
} 