export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: {
    reservationId: number;
    userId: number;
    prestataireId: number;
    statut: string;
    montant: number;
    commentaire?: string;
  };
}

export interface CalendarView {
  type: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  title: string;
  icon: string;
}

export interface CalendarFilter {
  prestataireIds: number[];
  userIds: number[];
  statuts: string[];
  showConfirmed: boolean;
  showPending: boolean;
  showCancelled: boolean;
  showCompleted: boolean;
}

export interface CalendarSettings {
  defaultView: string;
  locale: string;
  firstDay: number;
  slotMinTime: string;
  slotMaxTime: string;
  slotDuration: string;
  height: string | number;
  editable: boolean;
  selectable: boolean;
  selectMirror: boolean;
  dayMaxEvents: boolean | number;
  weekends: boolean;
  businessHours: {
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
  };
}

export interface CalendarEventClick {
  event: CalendarEvent;
  jsEvent: MouseEvent;
  view: any;
}

export interface CalendarDateSelect {
  start: Date;
  end: Date;
  allDay: boolean;
  view: any;
}

export interface CalendarEventDrop {
  event: CalendarEvent;
  oldEvent: CalendarEvent;
  delta: any;
  revert: () => void;
  view: any;
}

export interface CalendarEventResize {
  event: CalendarEvent;
  oldEvent: CalendarEvent;
  startDelta: any;
  endDelta: any;
  revert: () => void;
  view: any;
}

// Types pour les vues de calendrier
export const CALENDAR_VIEWS: CalendarView[] = [
  {
    type: 'dayGridMonth',
    title: 'Mois',
    icon: 'fas fa-calendar-alt'
  },
  {
    type: 'timeGridWeek',
    title: 'Semaine',
    icon: 'fas fa-calendar-week'
  },
  {
    type: 'timeGridDay',
    title: 'Jour',
    icon: 'fas fa-calendar-day'
  },
  {
    type: 'listWeek',
    title: 'Liste',
    icon: 'fas fa-list'
  }
];

// Couleurs par statut
export const EVENT_COLORS = {
  'En attente': {
    backgroundColor: '#ffc107',
    borderColor: '#e0a800',
    textColor: '#212529'
  },
  'Confirmée': {
    backgroundColor: '#28a745',
    borderColor: '#1e7e34',
    textColor: '#ffffff'
  },
  'Annulée': {
    backgroundColor: '#dc3545',
    borderColor: '#c82333',
    textColor: '#ffffff'
  },
  'Terminée': {
    backgroundColor: '#17a2b8',
    borderColor: '#138496',
    textColor: '#ffffff'
  },
  'Annulée par prestataire': {
    backgroundColor: '#6c757d',
    borderColor: '#545b62',
    textColor: '#ffffff'
  }
};

// Paramètres par défaut du calendrier
export const DEFAULT_CALENDAR_SETTINGS: CalendarSettings = {
  defaultView: 'dayGridMonth',
  locale: 'fr',
  firstDay: 1, // Lundi
  slotMinTime: '08:00:00',
  slotMaxTime: '20:00:00',
  slotDuration: '00:30:00',
  height: 'auto',
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: 3,
  weekends: true,
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5], // Lundi à vendredi
    startTime: '08:00',
    endTime: '18:00'
  }
}; 