import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  CalendarEvent, 
  CalendarFilter, 
  CalendarSettings,
  EVENT_COLORS,
  DEFAULT_CALENDAR_SETTINGS
} from '../models/calendar.model';
import { Reservation, ReservationStatut } from '../models/reservation.model';
import { ReservationService } from './reservation.service';
import { UserService } from './user.service';
import { PrestataireService } from './prestataire.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly baseUrl = 'https://localhost:7195/api';
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  private filterSubject = new BehaviorSubject<CalendarFilter>({
    prestataireIds: [],
    userIds: [],
    statuts: [],
    showConfirmed: true,
    showPending: true,
    showCancelled: false,
    showCompleted: true
  });

  public events$ = this.eventsSubject.asObservable();
  public filter$ = this.filterSubject.asObservable();

  constructor(
    private http: HttpClient,
    private reservationService: ReservationService,
    private userService: UserService,
    private prestataireService: PrestataireService
  ) {}

  // Charger les événements du calendrier
  loadCalendarEvents(filter?: CalendarFilter): Observable<CalendarEvent[]> {
    return this.reservationService.getReservations().pipe(
      map(reservations => this.convertReservationsToEvents(reservations, filter))
    );
  }

  // Convertir les réservations en événements de calendrier
  private convertReservationsToEvents(reservations: Reservation[], filter?: CalendarFilter): CalendarEvent[] {
    let filteredReservations = reservations;

    // Appliquer les filtres
    if (filter) {
      filteredReservations = this.applyFilters(reservations, filter);
    }

    return filteredReservations.map(reservation => this.createCalendarEvent(reservation));
  }

  // Créer un événement de calendrier à partir d'une réservation
  private createCalendarEvent(reservation: Reservation): CalendarEvent {
    const colors = EVENT_COLORS[reservation.statut as keyof typeof EVENT_COLORS] || EVENT_COLORS['En attente'];
    
    return {
      id: reservation.id,
      title: this.generateEventTitle(reservation),
      start: `${reservation.dateReservation}T${reservation.heureDebut}`,
      end: `${reservation.dateReservation}T${reservation.heureFin}`,
      allDay: false,
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      textColor: colors.textColor,
      extendedProps: {
        reservationId: reservation.id,
        userId: reservation.userId,
        prestataireId: reservation.prestataireId,
        statut: reservation.statut,
        montant: reservation.montant,
        commentaire: reservation.commentaire
      }
    };
  }

  // Générer le titre de l'événement
  private generateEventTitle(reservation: Reservation): string {
    let title = '';
    
    if (reservation.user) {
      title += `${reservation.user.nom} ${reservation.user.prenom}`;
    }
    
    if (reservation.prestataire) {
      title += ` - ${reservation.prestataire.nom} ${reservation.prestataire.prenom}`;
    }
    
    title += ` (${reservation.statut})`;
    
    return title;
  }

  // Appliquer les filtres
  private applyFilters(reservations: Reservation[], filter: CalendarFilter): Reservation[] {
    return reservations.filter(reservation => {
      // Filtre par prestataire
      if (filter.prestataireIds.length > 0 && !filter.prestataireIds.includes(reservation.prestataireId)) {
        return false;
      }

      // Filtre par utilisateur
      if (filter.userIds.length > 0 && !filter.userIds.includes(reservation.userId)) {
        return false;
      }

      // Filtre par statut
      if (filter.statuts.length > 0 && !filter.statuts.includes(reservation.statut)) {
        return false;
      }

      // Filtres booléens par statut
      if (!filter.showConfirmed && reservation.statut === ReservationStatut.Confirmee) {
        return false;
      }
      if (!filter.showPending && reservation.statut === ReservationStatut.EnAttente) {
        return false;
      }
      if (!filter.showCancelled && (reservation.statut === ReservationStatut.Annulee || reservation.statut === ReservationStatut.AnnuleeParPrestataire)) {
        return false;
      }
      if (!filter.showCompleted && reservation.statut === ReservationStatut.Terminee) {
        return false;
      }

      return true;
    });
  }

  // Mettre à jour les événements
  updateEvents(filter?: CalendarFilter): void {
    this.loadCalendarEvents(filter).subscribe(events => {
      this.eventsSubject.next(events);
    });
  }

  // Mettre à jour les filtres
  updateFilter(filter: Partial<CalendarFilter>): void {
    const currentFilter = this.filterSubject.value;
    const newFilter = { ...currentFilter, ...filter };
    this.filterSubject.next(newFilter);
    this.updateEvents(newFilter);
  }

  // Obtenir les paramètres du calendrier
  getCalendarSettings(): CalendarSettings {
    return { ...DEFAULT_CALENDAR_SETTINGS };
  }

  // Créer une nouvelle réservation depuis le calendrier
  createReservationFromCalendar(start: Date, end: Date, userId?: number, prestataireId?: number): Observable<Reservation> {
    const reservationData = {
      userId: userId || 1, // Valeur par défaut
      prestataireId: prestataireId || 1, // Valeur par défaut
      disponibiliteId: 1, // À adapter selon la logique
      dateReservation: start.toISOString().split('T')[0],
      heureDebut: start.toTimeString().split(' ')[0],
      heureFin: end.toTimeString().split(' ')[0],
      commentaire: 'Créé depuis le calendrier'
    };

    return this.reservationService.createReservation(reservationData);
  }

  // Mettre à jour une réservation depuis le calendrier
  updateReservationFromCalendar(eventId: number, start: Date, end: Date): Observable<Reservation> {
    const updateData: any = {
      dateReservation: start.toISOString().split('T')[0],
      heureDebut: start.toTimeString().split(' ')[0],
      heureFin: end.toTimeString().split(' ')[0]
    };

    return this.reservationService.updateReservation(eventId, updateData);
  }

  // Supprimer une réservation depuis le calendrier
  deleteReservationFromCalendar(eventId: number): Observable<void> {
    return this.reservationService.deleteReservation(eventId);
  }

  // Obtenir les événements pour une période donnée
  getEventsForPeriod(start: Date, end: Date, filter?: CalendarFilter): Observable<CalendarEvent[]> {
    return this.loadCalendarEvents(filter).pipe(
      map(events => events.filter(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return eventStart >= start && eventEnd <= end;
      }))
    );
  }

  // Obtenir les événements pour aujourd'hui
  getTodayEvents(filter?: CalendarFilter): Observable<CalendarEvent[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return this.getEventsForPeriod(startOfDay, endOfDay, filter);
  }

  // Obtenir les événements pour cette semaine
  getWeekEvents(filter?: CalendarFilter): Observable<CalendarEvent[]> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche
    endOfWeek.setHours(23, 59, 59, 999);
    
    return this.getEventsForPeriod(startOfWeek, endOfWeek, filter);
  }

  // Obtenir les événements pour ce mois
  getMonthEvents(filter?: CalendarFilter): Observable<CalendarEvent[]> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    
    return this.getEventsForPeriod(startOfMonth, endOfMonth, filter);
  }

  // Méthodes utilitaires
  formatEventTime(start: string, end: string): string {
    const startTime = new Date(start).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const endTime = new Date(end).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${startTime} - ${endTime}`;
  }

  formatEventDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getEventStatusColor(statut: string): string {
    const colors = EVENT_COLORS[statut as keyof typeof EVENT_COLORS];
    return colors ? colors.backgroundColor : '#6c757d';
  }

  isEventEditable(statut: string): boolean {
    return statut === ReservationStatut.EnAttente || statut === ReservationStatut.Confirmee;
  }

  isEventDeletable(statut: string): boolean {
    return statut === ReservationStatut.EnAttente;
  }
} 