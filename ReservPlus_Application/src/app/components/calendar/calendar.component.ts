import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent, CalendarFilter, CalendarSettings, CALENDAR_VIEWS } from '../../models/calendar.model';
import { Reservation, ReservationStatut } from '../../models/reservation.model';
import { User } from '../../models/user.model';
import { Prestataire } from '../../models/prestataire.model';
import { UserService } from '../../services/user.service';
import { PrestataireService } from '../../services/prestataire.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CalendarComponent implements OnInit, AfterViewInit {
  // @ViewChild('calendarEl') calendarEl!: ElementRef; // Removed as per new_code

  loading = false;
  errorMessage = '';
  
  // Données
  events: CalendarEvent[] = [];
  users: User[] = [];
  prestataires: Prestataire[] = [];
  
  // Formulaires
  filterForm: FormGroup;
  
  // Calendrier
  calendarSettings: CalendarSettings;
  currentView = 'dayGridMonth';
  calendarViews = CALENDAR_VIEWS;
  
  // État
  showFilters = false;
  showEventModal = false;
  selectedEvent: CalendarEvent | null = null;
  selectedDateRange: { start: Date; end: Date } | null = null;

  constructor(
    private calendarService: CalendarService,
    private reservationService: ReservationService,
    private userService: UserService,
    private prestataireService: PrestataireService,
    private fb: FormBuilder
  ) {
    this.calendarSettings = this.calendarService.getCalendarSettings();
    
    this.filterForm = this.fb.group({
      prestataireIds: [[]],
      userIds: [[]],
      statuts: [[]],
      showConfirmed: [true],
      showPending: [true],
      showCancelled: [false],
      showCompleted: [true]
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.setupFormListeners();
  }

  ngAfterViewInit(): void {
    this.initializeCalendar();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';

    Promise.all([
      this.loadUsers(),
      this.loadPrestataires(),
      this.loadEvents()
    ]).finally(() => {
      this.loading = false;
    });
  }

  private loadUsers(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.users = users;
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
          resolve();
        }
      });
    });
  }

  private loadPrestataires(): Promise<void> {
    return new Promise((resolve) => {
      this.prestataireService.getAllPrestataires().subscribe({
        next: (prestataires) => {
          this.prestataires = prestataires;
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des prestataires:', error);
          resolve();
        }
      });
    });
  }

  private loadEvents(): Promise<void> {
    return new Promise((resolve) => {
      const filter = this.getCurrentFilter();
      this.calendarService.loadCalendarEvents(filter).subscribe({
        next: (events) => {
          this.events = events;
          this.updateCalendarEvents();
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des événements:', error);
          this.errorMessage = 'Erreur lors du chargement des événements';
          resolve();
        }
      });
    });
  }

  setupFormListeners(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  initializeCalendar(): void {
    // Ici, nous utiliserions FullCalendar si installé
    // Pour l'instant, nous créons une interface simple
    this.updateCalendarEvents();
  }

  updateCalendarEvents(): void {
    // Mise à jour des événements du calendrier
    // Cette méthode serait appelée quand FullCalendar est configuré
  }

  getCurrentFilter(): CalendarFilter {
    return this.filterForm.value;
  }

  applyFilters(): void {
    const filter = this.getCurrentFilter();
    this.calendarService.updateFilter(filter);
    this.loadEvents();
  }

  onViewChange(view: string): void {
    this.currentView = view;
    // Mettre à jour la vue du calendrier
  }

  onEventClick(event: CalendarEvent): void {
    this.selectedEvent = event;
    this.showEventModal = true;
  }

  onDateSelect(selectInfo: any): void {
    this.selectedDateRange = {
      start: selectInfo.start,
      end: selectInfo.end
    };
    this.showEventModal = true;
  }

  onEventDrop(dropInfo: any): void {
    const { event, delta, revert } = dropInfo;
    
    if (this.calendarService.isEventEditable(event.extendedProps.statut)) {
      const newStart = new Date(event.start);
      const newEnd = new Date(event.end);
      
      this.calendarService.updateReservationFromCalendar(event.id, newStart, newEnd).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          revert();
          this.errorMessage = 'Erreur lors de la mise à jour de la réservation';
        }
      });
    } else {
      revert();
    }
  }

  onEventResize(resizeInfo: any): void {
    const { event, startDelta, endDelta, revert } = resizeInfo;
    
    if (this.calendarService.isEventEditable(event.extendedProps.statut)) {
      const newStart = new Date(event.start);
      const newEnd = new Date(event.end);
      
      this.calendarService.updateReservationFromCalendar(event.id, newStart, newEnd).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          revert();
          this.errorMessage = 'Erreur lors de la mise à jour de la réservation';
        }
      });
    } else {
      revert();
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  closeEventModal(): void {
    this.showEventModal = false;
    this.selectedEvent = null;
    this.selectedDateRange = null;
  }

  deleteEvent(event: CalendarEvent): void {
    if (this.calendarService.isEventDeletable(event.extendedProps.statut)) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
        this.calendarService.deleteReservationFromCalendar(event.id).subscribe({
          next: () => {
            this.loadEvents();
            this.closeEventModal();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            this.errorMessage = 'Erreur lors de la suppression de la réservation';
          }
        });
      }
    }
  }

  // Méthodes utilitaires
  getStatutOptions(): { value: string; label: string }[] {
    return [
      { value: ReservationStatut.EnAttente, label: 'En attente' },
      { value: ReservationStatut.Confirmee, label: 'Confirmée' },
      { value: ReservationStatut.Annulee, label: 'Annulée' },
      { value: ReservationStatut.Terminee, label: 'Terminée' },
      { value: ReservationStatut.AnnuleeParPrestataire, label: 'Annulée par prestataire' }
    ];
  }

  getUserName(userId: number): string {
    const user = this.users.find(u => u.id === userId.toString());
    return user ? `${user.nom} ${user.prenom}` : 'Inconnu';
  }

  getPrestataireName(prestataireId: number): string {
    const prestataire = this.prestataires.find(p => p.id === prestataireId);
    return prestataire ? `${prestataire.nom} ${prestataire.prenom}` : 'Inconnu';
  }

  formatEventTime(start: string, end: string): string {
    return this.calendarService.formatEventTime(start, end);
  }

  formatEventDate(date: string): string {
    return this.calendarService.formatEventDate(date);
  }

  getEventStatusColor(statut: string): string {
    return this.calendarService.getEventStatusColor(statut);
  }

  isEventEditable(statut: string): boolean {
    return this.calendarService.isEventEditable(statut);
  }

  isEventDeletable(statut: string): boolean {
    return this.calendarService.isEventDeletable(statut);
  }

  // Navigation du calendrier
  goToToday(): void {
    // Naviguer vers aujourd'hui
  }

  goToPrevious(): void {
    // Naviguer vers la période précédente
  }

  goToNext(): void {
    // Naviguer vers la période suivante
  }
} 