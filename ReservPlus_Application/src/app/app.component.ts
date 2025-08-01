import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { RoleService } from './services/role.service';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent],
  template: `
    <div class="min-vh-100 d-flex flex-column">
      <!-- Navigation -->
      <app-navigation></app-navigation>
      
      <!-- Contenu principal -->
      <main class="flex-grow-1">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="footer mt-auto">
        <div class="container py-5">
          <div class="row">
            <div class="col-lg-4 col-md-6 mb-4">
              <div class="d-flex align-items-center mb-3">
                <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <i class="material-icons text-primary">event</i>
                </div>
                <h3 class="h5 mb-0 text-dark">RéservPlus</h3>
              </div>
              <p class="text-secondary mb-3">
                La solution complète pour gérer vos réservations et optimiser votre planning professionnel.
              </p>
              <div class="d-flex gap-3">
                <a href="#" class="text-decoration-none">
                  <i class="material-icons text-primary">facebook</i>
                </a>
                <a href="#" class="text-decoration-none">
                  <i class="material-icons text-primary">twitter</i>
                </a>
                <a href="#" class="text-decoration-none">
                  <i class="material-icons text-primary">linkedin</i>
                </a>
              </div>
            </div>
            
            <div class="col-lg-2 col-md-6 mb-4">
              <h4 class="h6 mb-3 text-dark fw-semibold">Liens utiles</h4>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <a href="#" class="text-secondary text-decoration-none hover-link">
                    <i class="material-icons me-1" style="font-size: 1rem;">chevron_right</i>
                    À propos
                  </a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-secondary text-decoration-none hover-link">
                    <i class="material-icons me-1" style="font-size: 1rem;">chevron_right</i>
                    Services
                  </a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-secondary text-decoration-none hover-link">
                    <i class="material-icons me-1" style="font-size: 1rem;">chevron_right</i>
                    Contact
                  </a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-secondary text-decoration-none hover-link">
                    <i class="material-icons me-1" style="font-size: 1rem;">chevron_right</i>
                    Support
                  </a>
                </li>
              </ul>
            </div>
            
            <div class="col-lg-2 col-md-6 mb-4">
              <h4 class="h6 mb-3 text-dark fw-semibold">Services</h4>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <a href="#" class="text-secondary text-decoration-none hover-link">
                    <i class="material-icons me-1" style="font-size: 1rem;">chevron_right</i>
                    Réservations
                  </a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-secondary text-decoration-none hover-link">
                    <i class="material-icons me-1" style="font-size: 1rem;">chevron_right</i>
                    Gestion
                  </a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-secondary text-decoration-none hover-link">
                    <i class="material-icons me-1" style="font-size: 1rem;">chevron_right</i>
                    Rapports
                  </a>
                </li>
                <li class="mb-2">
                  <a href="#" class="text-secondary text-decoration-none hover-link">
                    <i class="material-icons me-1" style="font-size: 1rem;">chevron_right</i>
                    API
                  </a>
                </li>
              </ul>
            </div>
            
            <div class="col-lg-4 col-md-6 mb-4">
              <h4 class="h6 mb-3 text-dark fw-semibold">Contact</h4>
              <div class="mb-3">
                <div class="d-flex align-items-center mb-2">
                  <div class="bg-primary bg-opacity-10 rounded-circle p-1 me-2">
                    <i class="material-icons text-primary" style="font-size: 1rem;">email</i>
                  </div>
                  <span class="text-secondary">contact&#64;reservplus.com</span>
                </div>
                <div class="d-flex align-items-center mb-2">
                  <div class="bg-primary bg-opacity-10 rounded-circle p-1 me-2">
                    <i class="material-icons text-primary" style="font-size: 1rem;">phone</i>
                  </div>
                  <span class="text-secondary">+33 1 23 45 67 89</span>
                </div>
                <div class="d-flex align-items-center">
                  <div class="bg-primary bg-opacity-10 rounded-circle p-1 me-2">
                    <i class="material-icons text-primary" style="font-size: 1rem;">location_on</i>
                  </div>
                  <span class="text-secondary">Lomé-Togo</span>
                </div>
              </div>
              
              <div class="d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm">
                  <i class="material-icons me-1" style="font-size: 1rem;">support_agent</i>
                  Support
                </button>
                <button class="btn btn-primary btn-sm">
                  <i class="material-icons me-1" style="font-size: 1rem;">contact_support</i>
                  Contact
                </button>
              </div>
            </div>
          </div>
          
          <hr class="my-4 border-secondary">
          
          <div class="row align-items-center">
            <div class="col-md-6 mb-3 mb-md-0">
              <p class="text-secondary mb-0">
                &copy; 2024 RéservPlus. Tous droits réservés.
              </p>
            </div>
            <div class="col-md-6 text-md-end">
              <div class="d-flex gap-3 justify-content-md-end">
                <a href="#" class="text-secondary text-decoration-none small">Mentions légales</a>
                <a href="#" class="text-secondary text-decoration-none small">Politique de confidentialité</a>
                <a href="#" class="text-secondary text-decoration-none small">CGU</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .footer {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-top: 1px solid #dee2e6;
      color: #495057;
    }
    
    .hover-link {
      transition: all 0.3s ease;
    }
    
    .hover-link:hover {
      color: #0d6efd !important;
      transform: translateX(3px);
    }
    
    .footer a:hover {
      color: #0d6efd !important;
    }
    
    .footer .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .footer .material-icons {
      transition: all 0.3s ease;
    }
    
    .footer a:hover .material-icons {
      transform: scale(1.1);
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    // Initialiser l'état d'authentification
    console.log('Application initialisée');
  }
} 