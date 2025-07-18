import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Notification, NotificationType } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showDropdown = false;
  loading = false;
  errorMessage = '';

  private notificationsSubscription!: Subscription;
  private unreadCountSubscription!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationsSubscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );

    this.unreadCountSubscription = this.notificationService.unreadCount$.subscribe(
      count => {
        this.unreadCount = count;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  markAsRead(notification: Notification): void {
    if (!notification.lu) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          this.notificationService.updateNotificationLocal(notification.id, { lu: true });
        },
        error: (error) => {
          console.error('Erreur lors du marquage comme lu:', error);
          this.errorMessage = 'Erreur lors du marquage comme lu';
        }
      });
    }

    // Naviguer vers le lien si disponible
    if (notification.lien) {
      this.router.navigate([notification.lien]);
    }

    this.closeDropdown();
  }

  markAllAsRead(): void {
    this.loading = true;
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(notification => {
          if (!notification.lu) {
            this.notificationService.updateNotificationLocal(notification.id, { lu: true });
          }
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du marquage de toutes les notifications:', error);
        this.errorMessage = 'Erreur lors du marquage de toutes les notifications';
        this.loading = false;
      }
    });
  }

  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      this.notificationService.deleteNotification(notification.id).subscribe({
        next: () => {
          this.notificationService.removeNotification(notification.id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.errorMessage = 'Erreur lors de la suppression de la notification';
        }
      });
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case NotificationType.Success:
        return 'fas fa-check-circle';
      case NotificationType.Warning:
        return 'fas fa-exclamation-triangle';
      case NotificationType.Error:
        return 'fas fa-times-circle';
      case NotificationType.Reservation:
        return 'fas fa-calendar-check';
      case NotificationType.Paiement:
        return 'fas fa-credit-card';
      case NotificationType.Info:
      default:
        return 'fas fa-info-circle';
    }
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case NotificationType.Success:
        return 'notification-success';
      case NotificationType.Warning:
        return 'notification-warning';
      case NotificationType.Error:
        return 'notification-error';
      case NotificationType.Reservation:
        return 'notification-reservation';
      case NotificationType.Paiement:
        return 'notification-paiement';
      case NotificationType.Info:
      default:
        return 'notification-info';
    }
  }

  formatDate(date: string): string {
    const notificationDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(notification => !notification.lu);
  }

  getReadNotifications(): Notification[] {
    return this.notifications.filter(notification => notification.lu);
  }
} 