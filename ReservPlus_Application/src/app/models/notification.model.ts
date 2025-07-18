export interface Notification {
  id: number;
  titre: string;
  message: string;
  type: NotificationType;
  lu: boolean;
  dateCreation: string;
  userId?: number;
  reservationId?: number;
  lien?: string;
}

export enum NotificationType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Reservation = 'reservation',
  Paiement = 'paiement'
}

export interface CreateNotificationRequest {
  titre: string;
  message: string;
  type: NotificationType;
  userId?: number;
  reservationId?: number;
  lien?: string;
}

export interface UpdateNotificationRequest {
  lu?: boolean;
} 