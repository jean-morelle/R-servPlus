import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { ROLES } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.authState$.pipe(
      take(1),
      map(authState => {
        // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
        if (!authState.isAuthenticated) {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return false;
        }

        const user = authState.user;
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        // Vérifier les rôles requis depuis les données de la route
        const requiredRoles = route.data['roles'] as string[];
        const requiredPermissions = route.data['permissions'] as string[];

        // Si aucun rôle ou permission requis, autoriser l'accès
        if (!requiredRoles && !requiredPermissions) {
          return true;
        }

        // Vérifier les permissions si spécifiées
        if (requiredPermissions && requiredPermissions.length > 0) {
          const hasPermission = requiredPermissions.some(permission => 
            this.roleService.hasPermission(permission)
          );
          
          if (!hasPermission) {
            this.showAccessDenied();
            return false;
          }
        }

        // Vérifier les rôles si spécifiés
        if (requiredRoles && requiredRoles.length > 0) {
          const hasRole = requiredRoles.includes(user.role);
          
          if (!hasRole) {
            this.showAccessDenied();
            return false;
          }
        }

        return true;
      })
    );
  }

  private showAccessDenied(): void {
    // Rediriger vers une page d'accès refusé ou afficher un message
    this.router.navigate(['/access-denied']);
  }
}

// Guard spécifique pour les administrateurs
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.authState$.pipe(
      take(1),
      map(authState => {
        if (!authState.isAuthenticated) {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return false;
        }

        if (!this.roleService.isAdmin()) {
          this.router.navigate(['/access-denied']);
          return false;
        }

        return true;
      })
    );
  }
}

// Guard spécifique pour les prestataires
@Injectable({
  providedIn: 'root'
})
export class PrestataireGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.authState$.pipe(
      take(1),
      map(authState => {
        if (!authState.isAuthenticated) {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return false;
        }

        if (!this.roleService.isPrestataire() && !this.roleService.isAdmin()) {
          this.router.navigate(['/access-denied']);
          return false;
        }

        return true;
      })
    );
  }
} 