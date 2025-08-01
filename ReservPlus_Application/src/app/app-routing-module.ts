import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { PrestataireListComponent } from './components/prestataire-list/prestataire-list.component';
import { DisponibiliteListComponent } from './components/disponibilite-list/disponibilite-list.component';
import { PaiementListComponent } from './components/paiement-list/paiement-list.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { ReportsComponent } from './components/reports/reports.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { RoleGuard, AdminGuard as RoleAdminGuard, PrestataireGuard } from './guards/role.guard';
import { RegisterComponent } from './components/register/register.component';
import { AboutComponent } from './components/about/about.component';
import { BlogComponent } from './components/blog/blog.component';
import { ContactComponent } from './components/contact/contact.component';
import { FeaturesComponent } from './components/features/features.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';

export const routes: Routes = [
  // Routes publiques
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'feature', redirectTo: '/features', pathMatch: 'full' },
  
  // Page d'accès refusé
  { path: 'access-denied', component: AccessDeniedComponent },
  
  // Routes protégées par authentification
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [RoleGuard] 
  },
  
  // Routes pour tous les utilisateurs authentifiés
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [RoleGuard] 
  },
  
  // Routes pour les utilisateurs normaux
  { 
    path: 'reservations', 
    component: ReservationListComponent, 
    canActivate: [RoleGuard],
    data: { roles: ['User', 'Prestataire', 'Admin'] }
  },
  { 
    path: 'paiements', 
    component: PaiementListComponent, 
    canActivate: [RoleGuard],
    data: { roles: ['User', 'Prestataire', 'Admin'] }
  },
  
  // Routes pour les prestataires et admins
  { 
    path: 'disponibilites', 
    component: DisponibiliteListComponent, 
    canActivate: [PrestataireGuard]
  },
  { 
    path: 'services', 
    loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent),
    canActivate: [PrestataireGuard]
  },
  
  // Routes pour les administrateurs uniquement
  { 
    path: 'users', 
    component: UserListComponent, 
    canActivate: [RoleAdminGuard],
    data: { permissions: ['users.manage'] }
  },
  { 
    path: 'prestataires', 
    component: PrestataireListComponent, 
    canActivate: [RoleAdminGuard],
    data: { permissions: ['prestataires.manage'] }
  },
  { 
    path: 'reports', 
    component: ReportsComponent, 
    canActivate: [RoleAdminGuard],
    data: { permissions: ['reports.view'] }
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [RoleAdminGuard],
    data: { permissions: ['settings.manage'] }
  },
  
  // Routes Admin (pour compatibilité) - utilisent DashboardComponent
  { 
    path: 'admin', 
    component: DashboardComponent, 
    canActivate: [RoleAdminGuard] 
  },
  { 
    path: 'admin/dashboard', 
    component: DashboardComponent, 
    canActivate: [RoleAdminGuard] 
  },
  { 
    path: 'admin/users', 
    component: UserListComponent, 
    canActivate: [RoleAdminGuard] 
  },
  { 
    path: 'admin/prestataires', 
    component: PrestataireListComponent, 
    canActivate: [RoleAdminGuard] 
  },
  { 
    path: 'admin/paiements', 
    component: PaiementListComponent, 
    canActivate: [RoleAdminGuard] 
  },
  { 
    path: 'admin/reports', 
    component: ReportsComponent, 
    canActivate: [RoleAdminGuard] 
  },
  
  // Route par défaut
  { path: '**', redirectTo: '/home' }
];

