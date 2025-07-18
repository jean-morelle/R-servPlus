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
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'users', 
    component: UserListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'prestataires', 
    component: PrestataireListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'disponibilites', 
    component: DisponibiliteListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'paiements', 
    component: PaiementListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'reservations', 
    component: ReservationListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'reports', 
    component: ReportsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'calendar', 
    component: CalendarComponent, 
    canActivate: [AuthGuard] 
  }
];
