import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation, ReservationStatut } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { PrestataireService } from '../../services/prestataire.service';
import { User } from '../../models/user.model';
import { Prestataire } from '../../models/prestataire.model';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReservationFormComponent]
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  users: User[] = [];
  prestataires: Prestataire[] = [];
  loading = false;
  errorMessage = '';
  showForm = false;
  selectedReservation: Reservation | null = null;
  isEditMode = false;

  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private prestataireService: PrestataireService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadUsers();
    this.loadPrestataires();
  }

  loadReservations(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.reservationService.getReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réservations:', error);
        this.errorMessage = 'Erreur lors du chargement des réservations';
        this.loading = false;
      }
    });
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

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId.toString());
    return user ? `${user.nom} ${user.prenom}` : 'Inconnu';
  }

  getPrestataireName(prestataireId: number): string {
    const prestataire = this.prestataires.find(p => p.id === prestataireId);
    return prestataire ? `${prestataire.nom} ${prestataire.prenom}` : 'Inconnu';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  addReservation(): void {
    this.selectedReservation = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  editReservation(reservation: Reservation): void {
    this.selectedReservation = { ...reservation };
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.loadReservations();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.errorMessage = 'Erreur lors de la suppression de la réservation';
        }
      });
    }
  }

  confirmReservation(id: number): void {
    this.reservationService.confirmReservation(id).subscribe({
      next: () => {
        this.loadReservations();
      },
      error: (error) => {
        console.error('Erreur lors de la confirmation:', error);
        this.errorMessage = 'Erreur lors de la confirmation de la réservation';
      }
    });
  }

  cancelReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.reservationService.cancelReservation(id).subscribe({
        next: () => {
          this.loadReservations();
        },
        error: (error) => {
          console.error('Erreur lors de l\'annulation:', error);
          this.errorMessage = 'Erreur lors de l\'annulation de la réservation';
        }
      });
    }
  }

  completeReservation(id: number): void {
    this.reservationService.completeReservation(id).subscribe({
      next: () => {
        this.loadReservations();
      },
      error: (error) => {
        console.error('Erreur lors de la finalisation:', error);
        this.errorMessage = 'Erreur lors de la finalisation de la réservation';
      }
    });
  }

  onReservationSaved(reservation: Reservation): void {
    this.showForm = false;
    this.selectedReservation = null;
    this.loadReservations();
  }

  onFormCancelled(): void {
    this.showForm = false;
    this.selectedReservation = null;
  }

  getStatusClass(statut: ReservationStatut): string {
    switch (statut) {
      case ReservationStatut.Confirmee:
        return 'status-confirmed';
      case ReservationStatut.EnAttente:
        return 'status-pending';
      case ReservationStatut.Annulee:
      case ReservationStatut.AnnuleeParPrestataire:
        return 'status-cancelled';
      case ReservationStatut.Terminee:
        return 'status-completed';
      default:
        return 'status-unknown';
    }
  }

  getStatusText(statut: ReservationStatut): string {
    switch (statut) {
      case ReservationStatut.Confirmee:
        return 'Confirmée';
      case ReservationStatut.EnAttente:
        return 'En attente';
      case ReservationStatut.Annulee:
        return 'Annulée';
      case ReservationStatut.AnnuleeParPrestataire:
        return 'Annulée par prestataire';
      case ReservationStatut.Terminee:
        return 'Terminée';
      default:
        return 'Inconnu';
    }
  }

  canConfirm(reservation: Reservation): boolean {
    return reservation.statut === ReservationStatut.EnAttente;
  }

  canCancel(reservation: Reservation): boolean {
    return reservation.statut === ReservationStatut.EnAttente || 
           reservation.statut === ReservationStatut.Confirmee;
  }

  canComplete(reservation: Reservation): boolean {
    return reservation.statut === ReservationStatut.Confirmee;
  }

  canEdit(reservation: Reservation): boolean {
    return reservation.statut === ReservationStatut.EnAttente || 
           reservation.statut === ReservationStatut.Confirmee;
  }
} 