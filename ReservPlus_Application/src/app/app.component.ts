import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { UserInfo } from './models/auth.model';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent, NotificationsComponent]
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  currentUser: UserInfo | null = null;
  isHomePage = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(authState => {
      this.isAuthenticated = authState.isAuthenticated;
      this.currentUser = authState.user;
    });

    // Détecter la page d'accueil
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isHomePage = event.url === '/' || event.url === '/home';
    });
  }

  logout(): void {
    this.authService.logout();
  }
} 