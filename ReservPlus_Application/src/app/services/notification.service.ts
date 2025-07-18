import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Notification, CreateNotificationRequest, UpdateNotificationRequest } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly baseUrl = 'https://localhost:7195/api';
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadNotifications();
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications`);
  }

  getNotification(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.baseUrl}/notifications/${id}`);
  }

  createNotification(notification: CreateNotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(`${this.baseUrl}/notifications`, notification);
  }

  updateNotification(id: number, notification: UpdateNotificationRequest): Observable<Notification> {
    return this.http.put<Notification>(`${this.baseUrl}/notifications/${id}`, notification);
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/notifications/${id}`);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.updateNotification(id, { lu: true });
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/notifications/mark-all-read`, {});
  }

  getNotificationsByUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications/user/${userId}`);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/notifications/unread-count`);
  }

  // Méthodes pour la gestion locale des notifications
  loadNotifications(): void {
    this.getNotifications().subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    });
  }

  addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications];
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  updateNotificationLocal(id: number, updates: Partial<Notification>): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === id ? { ...notification, ...updates } : notification
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  removeNotification(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(notification => notification.id !== id);
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(notification => !notification.lu).length;
    this.unreadCountSubject.next(unreadCount);
  }

  // Méthodes utilitaires pour créer des notifications
  createReservationNotification(reservationId: number, message: string, userId?: number): void {
    const notification: CreateNotificationRequest = {
      titre: 'Nouvelle réservation',
      message: message,
      type: 'reservation' as any,
      reservationId: reservationId,
      userId: userId,
      lien: `/reservations`
    };

    this.createNotification(notification).subscribe({
      next: (newNotification) => {
        this.addNotification(newNotification);
      },
      error: (error) => {
        console.error('Erreur lors de la création de la notification:', error);
      }
    });
  }

  createPaiementNotification(paiementId: number, message: string, userId?: number): void {
    const notification: CreateNotificationRequest = {
      titre: 'Paiement traité',
      message: message,
      type: 'paiement' as any,
      userId: userId,
      lien: `/paiements`
    };

    this.createNotification(notification).subscribe({
      next: (newNotification) => {
        this.addNotification(newNotification);
      },
      error: (error) => {
        console.error('Erreur lors de la création de la notification:', error);
      }
    });
  }

  createInfoNotification(titre: string, message: string, userId?: number): void {
    const notification: CreateNotificationRequest = {
      titre: titre,
      message: message,
      type: 'info' as any,
      userId: userId
    };

    this.createNotification(notification).subscribe({
      next: (newNotification) => {
        this.addNotification(newNotification);
      },
      error: (error) => {
        console.error('Erreur lors de la création de la notification:', error);
      }
    });
  }
} 