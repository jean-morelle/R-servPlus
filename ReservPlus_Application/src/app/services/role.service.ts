import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ROLES, UserRole } from '../models/auth.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private authService: AuthService) { }

  // Vérifier si l'utilisateur est administrateur
  isAdmin(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === ROLES.ADMIN;
  }

  // Vérifier si l'utilisateur est prestataire
  isPrestataire(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === ROLES.PRESTATAIRE;
  }

  // Vérifier si l'utilisateur est un utilisateur normal
  isUser(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === ROLES.USER;
  }

  // Obtenir le rôle actuel
  getCurrentRole(): UserRole | null {
    const user = this.authService.getCurrentUser();
    return user?.role as UserRole || null;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role: UserRole): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === role;
  }

  // Vérifier si l'utilisateur a au moins un des rôles spécifiés
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.authService.getCurrentUser();
    return user ? roles.includes(user.role as UserRole) : false;
  }

  // Observable pour surveiller les changements de rôle
  getCurrentRole$(): Observable<UserRole | null> {
    return this.authService.authState$.pipe(
      map(state => state.user?.role as UserRole || null)
    );
  }

  // Obtenir les permissions selon le rôle
  getPermissions(): string[] {
    const user = this.authService.getCurrentUser();
    if (!user) return [];

    switch (user.role) {
      case ROLES.ADMIN:
        return [
          'users.manage',
          'users.view',
          'reservations.manage',
          'reservations.view',
          'prestataires.manage',
          'prestataires.view',
          'services.manage',
          'services.view',
          'reports.view',
          'settings.manage'
        ];
      
      case ROLES.PRESTATAIRE:
        return [
          'reservations.view',
          'reservations.manage',
          'services.view',
          'services.manage',
          'disponibilites.manage',
          'profile.manage'
        ];
      
      case ROLES.USER:
        return [
          'reservations.view',
          'reservations.create',
          'services.view',
          'profile.manage'
        ];
      
      default:
        return [];
    }
  }

  // Vérifier si l'utilisateur a une permission spécifique
  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  // Obtenir les éléments de menu selon le rôle
  getMenuItems(): any[] {
    const user = this.authService.getCurrentUser();
    if (!user) return [];

    const baseMenu = [
      { label: 'Accueil', icon: 'home', route: '/home', visible: true },
      { label: 'Mon Profil', icon: 'person', route: '/profile', visible: true }
    ];

    switch (user.role) {
      case ROLES.ADMIN:
        return [
          ...baseMenu,
          { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard', visible: true },
          { label: 'Utilisateurs', icon: 'people', route: '/users', visible: true },
          { label: 'Prestataires', icon: 'business', route: '/prestataires', visible: true },
          { label: 'Services', icon: 'build', route: '/services', visible: true },
          { label: 'Réservations', icon: 'event', route: '/reservations', visible: true },
          { label: 'Paiements', icon: 'payment', route: '/paiements', visible: true },
          { label: 'Rapports', icon: 'analytics', route: '/reports', visible: true },
          { label: 'Paramètres', icon: 'settings', route: '/settings', visible: true }
        ];
      
      case ROLES.PRESTATAIRE:
        return [
          ...baseMenu,
          { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard', visible: true },
          { label: 'Mes Services', icon: 'build', route: '/services', visible: true },
          { label: 'Disponibilités', icon: 'schedule', route: '/disponibilites', visible: true },
          { label: 'Réservations', icon: 'event', route: '/reservations', visible: true },
          { label: 'Paiements', icon: 'payment', route: '/paiements', visible: true }
        ];
      
      case ROLES.USER:
        return [
          ...baseMenu,
          { label: 'Tableau de bord', icon: 'dashboard', route: '/dashboard', visible: true },
          { label: 'Mes Réservations', icon: 'event', route: '/reservations', visible: true },
          { label: 'Mes Paiements', icon: 'payment', route: '/paiements', visible: true }
        ];
      
      default:
        return baseMenu;
    }
  }
} 