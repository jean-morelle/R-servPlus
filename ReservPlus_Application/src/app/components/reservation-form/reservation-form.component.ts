import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reservation, ReservationStatut } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { PrestataireService } from '../../services/prestataire.service';
import { DisponibiliteService } from '../../services/disponibilite.service';
import { User } from '../../models/user.model';
import { Prestataire } from '../../models/prestataire.model';
import { Disponibilite } from '../../models/disponibilite.model';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ReservationFormComponent implements OnInit {
  @Input() reservation: Reservation | null = null;
  @Input() isEditMode: boolean = false;
  @Output() saved = new EventEmitter<Reservation>();
  @Output() cancelled = new EventEmitter<void>();

  reservationForm: FormGroup;
  users: User[] = [];
  prestataires: Prestataire[] = [];
  disponibilites: Disponibilite[] = [];
  filteredDisponibilites: Disponibilite[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private userService: UserService,
    private prestataireService: PrestataireService,
    private disponibiliteService: DisponibiliteService
  ) {
    this.reservationForm = this.fb.group({
      userId: ['', Validators.required],
      prestataireId: ['', Validators.required],
      disponibiliteId: ['', Validators.required],
      dateReservation: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      commentaire: [''],
      statut: [ReservationStatut.EnAttente]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadPrestataires();
    this.loadDisponibilites();
    
    if (this.reservation && this.isEditMode) {
      this.populateForm();
    }

    // Écouter les changements de prestataire pour filtrer les disponibilités
    this.reservationForm.get('prestataireId')?.valueChanges.subscribe(prestataireId => {
      this.filterDisponibilites(prestataireId);
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
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
        this.errorMessage = 'Erreur lors du chargement des prestataires';
      }
    });
  }

  loadDisponibilites(): void {
    this.disponibiliteService.getAllDisponibilites().subscribe({
      next: (disponibilites) => {
        this.disponibilites = disponibilites;
        this.filterDisponibilites(this.reservationForm.get('prestataireId')?.value);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des disponibilités:', error);
        this.errorMessage = 'Erreur lors du chargement des disponibilités';
      }
    });
  }

  filterDisponibilites(prestataireId: number): void {
    if (prestataireId) {
      this.filteredDisponibilites = this.disponibilites.filter(d => 
        d.prestataireId === prestataireId && d.estDisponible
      );
    } else {
      this.filteredDisponibilites = [];
    }
    
    // Réinitialiser la disponibilité sélectionnée si elle n'est plus valide
    const currentDisponibiliteId = this.reservationForm.get('disponibiliteId')?.value;
    if (currentDisponibiliteId && !this.filteredDisponibilites.find(d => d.id === currentDisponibiliteId)) {
      this.reservationForm.patchValue({ disponibiliteId: '' });
    }
  }

  populateForm(): void {
    if (this.reservation) {
      this.reservationForm.patchValue({
        userId: this.reservation.userId,
        prestataireId: this.reservation.prestataireId,
        disponibiliteId: this.reservation.disponibiliteId,
        dateReservation: this.formatDateForInput(this.reservation.dateReservation),
        heureDebut: this.reservation.heureDebut,
        heureFin: this.reservation.heureFin,
        commentaire: this.reservation.commentaire || '',
        statut: this.reservation.statut
      });
      
      this.filterDisponibilites(this.reservation.prestataireId);
    }
  }

  formatDateForInput(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }

  formatTimeForInput(time: string): string {
    return time.substring(0, 5); // Format HH:mm
  }

  onDisponibiliteChange(): void {
    const disponibiliteId = this.reservationForm.get('disponibiliteId')?.value;
    const disponibilite = this.disponibilites.find(d => d.id === disponibiliteId);
    
    if (disponibilite) {
      this.reservationForm.patchValue({
        dateReservation: disponibilite.date,
        heureDebut: disponibilite.heureDebut,
        heureFin: disponibilite.heureFin
      });
    }
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formValue = this.reservationForm.value;

      if (this.isEditMode && this.reservation) {
        const updateData: any = { // Assuming UpdateReservationRequest is not directly imported or defined here
          statut: formValue.statut,
          commentaire: formValue.commentaire
        };

        this.reservationService.updateReservation(this.reservation.id, updateData).subscribe({
          next: (updatedReservation) => {
            this.loading = false;
            this.saved.emit(updatedReservation);
          },
          error: (error) => {
            this.loading = false;
            console.error('Erreur lors de la mise à jour:', error);
            this.errorMessage = 'Erreur lors de la mise à jour de la réservation';
          }
        });
      } else {
        const createData: any = { // Assuming CreateReservationRequest is not directly imported or defined here
          userId: formValue.userId,
          prestataireId: formValue.prestataireId,
          disponibiliteId: formValue.disponibiliteId,
          dateReservation: formValue.dateReservation,
          heureDebut: formValue.heureDebut,
          heureFin: formValue.heureFin,
          commentaire: formValue.commentaire
        };

        this.reservationService.createReservation(createData).subscribe({
          next: (newReservation) => {
            this.loading = false;
            this.saved.emit(newReservation);
          },
          error: (error) => {
            this.loading = false;
            console.error('Erreur lors de la création:', error);
            this.errorMessage = 'Erreur lors de la création de la réservation';
          }
        });
      }
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.reservationForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} est requis`;
      }
    }
    return '';
  }

  getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      userId: 'Utilisateur',
      prestataireId: 'Prestataire',
      disponibiliteId: 'Disponibilité',
      dateReservation: 'Date de réservation',
      heureDebut: 'Heure de début',
      heureFin: 'Heure de fin',
      commentaire: 'Commentaire',
      statut: 'Statut'
    };
    return fieldNames[fieldName] || fieldName;
  }

  getStatutOptions(): { value: string; label: string }[] {
    return [
      { value: ReservationStatut.EnAttente, label: 'En attente' },
      { value: ReservationStatut.Confirmee, label: 'Confirmée' },
      { value: ReservationStatut.Annulee, label: 'Annulée' },
      { value: ReservationStatut.Terminee, label: 'Terminée' },
      { value: ReservationStatut.AnnuleeParPrestataire, label: 'Annulée par prestataire' }
    ];
  }
} 