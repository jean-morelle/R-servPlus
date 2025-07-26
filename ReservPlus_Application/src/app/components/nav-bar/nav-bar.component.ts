import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  navItems = [
    { path: '/prestataires', label: 'Prestataires', icon: 'fas fa-users' },
    { path: '/disponibilites', label: 'Disponibilités', icon: 'fas fa-calendar-alt' },
    { path: '/paiements', label: 'Paiements', icon: 'fas fa-credit-card' },
    { path: '/users', label: 'Utilisateurs', icon: 'fas fa-user-friends' },
    { path: '/about', label: 'À propos', icon: 'fas fa-info-circle' },
    { path: '/blog', label: 'Blog', icon: 'fas fa-blog' },
    { path: '/contact', label: 'Contact', icon: 'fas fa-envelope' }
  ];
} 