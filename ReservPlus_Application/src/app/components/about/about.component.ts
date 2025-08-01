import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid p-0">
      <!-- Hero Section -->
      <section class="hero-section text-white py-5">
        <div class="container">
          <div class="row justify-content-center text-center">
            <div class="col-lg-8">
              <div class="d-flex align-items-center justify-content-center mb-4">
                <div class="hero-icon rounded-circle p-3 me-3">
                  <i class="material-icons text-white" style="font-size: 2.5rem;">business</i>
                </div>
                <h1 class="display-4 fw-bold mb-0">À propos de RéservPlus</h1>
              </div>
              <p class="lead mb-4">Votre plateforme de réservation de services de confiance</p>
              <p class="fs-5 opacity-75">
                RéservPlus est né de la volonté de simplifier et moderniser la gestion des réservations de services. 
                Notre mission est de connecter efficacement les utilisateurs avec des prestataires de qualité, 
                tout en offrant une expérience fluide et intuitive.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Notre Histoire -->
      <section class="py-5 bg-light">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6 mb-4 mb-lg-0">
              <h2 class="h1 fw-bold text-dark mb-4">
                <i class="material-icons me-3 text-success">history</i>
                Notre Histoire
              </h2>
              <p class="fs-5 text-secondary mb-4">
                Fondée en 2024, RéservPlus est le fruit d'une vision simple : créer une plateforme 
                qui révolutionne la façon dont les gens réservent des services. Notre équipe, 
                composée d'experts en technologie et en gestion de services, a développé une solution 
                complète qui répond aux besoins modernes des utilisateurs et des prestataires.
              </p>
              <p class="fs-5 text-secondary">
                Depuis nos débuts, nous avons aidé des centaines d'utilisateurs à trouver les services 
                dont ils ont besoin, et des dizaines de prestataires à développer leur activité. 
                Notre engagement envers l'innovation et la satisfaction client nous pousse à 
                améliorer constamment notre plateforme.
              </p>
            </div>
            <div class="col-lg-6">
              <div class="card border-0 shadow-lg">
                <div class="card-body p-0">
                  <div class="story-card p-5 text-center">
                    <i class="material-icons text-warning" style="font-size: 8rem;">timeline</i>
                    <h4 class="mt-3 text-dark">Une vision d'avenir</h4>
                    <p class="text-secondary">Transformer la gestion des réservations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Statistiques -->
      <section class="py-5">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="h1 fw-bold text-dark">
              <i class="material-icons me-3 text-info">analytics</i>
              Nos Chiffres Clés
            </h2>
            <p class="lead text-secondary">Des résultats qui parlent d'eux-mêmes</p>
          </div>
          <div class="row g-4">
            <div class="col-md-3 col-sm-6" *ngFor="let stat of stats; let i = index">
              <div class="card border-0 shadow-sm h-100 text-center stat-card">
                <div class="card-body py-4">
                  <div class="stat-icon rounded-circle d-inline-flex p-3 mb-3" [class]="'stat-icon-' + (i + 1)">
                    <i class="material-icons text-white" style="font-size: 2rem;">{{ stat.icon }}</i>
                  </div>
                  <h3 class="display-6 fw-bold mb-2" [class]="'text-' + stat.color">{{ stat.number }}</h3>
                  <p class="text-secondary mb-0">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Nos Valeurs -->
      <section class="py-5 bg-light">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="h1 fw-bold text-dark">
              <i class="material-icons me-3 text-danger">favorite</i>
              Nos Valeurs
            </h2>
            <p class="lead text-secondary">Les principes qui nous guident</p>
          </div>
          <div class="row g-4">
            <div class="col-lg-3 col-md-6" *ngFor="let value of values; let i = index">
              <div class="card border-0 shadow-sm h-100 text-center value-card">
                <div class="card-body py-4">
                  <div class="value-icon rounded-circle d-inline-flex p-3 mb-3" [class]="'value-icon-' + (i + 1)">
                    <i class="material-icons text-white" style="font-size: 2rem;">{{ value.icon }}</i>
                  </div>
                  <h4 class="fw-bold mb-3" [class]="'text-' + value.color">{{ value.title }}</h4>
                  <p class="text-secondary mb-0">{{ value.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Notre Équipe -->
      <section class="py-5">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="h1 fw-bold text-dark">
              <i class="material-icons me-3 text-primary">people</i>
              Notre Équipe
            </h2>
            <p class="lead text-secondary">Les experts derrière RéservPlus</p>
          </div>
          <div class="row g-4">
            <div class="col-lg-4 col-md-6" *ngFor="let member of teamMembers; let i = index">
              <div class="card border-0 shadow-sm h-100 team-card">
                <div class="card-body text-center p-4">
                  <div class="team-icon rounded-circle d-inline-flex p-4 mb-4" [class]="'team-icon-' + (i + 1)">
                    <i class="material-icons text-white" style="font-size: 3rem;">{{ member.icon }}</i>
                  </div>
                  <h4 class="fw-bold mb-2" [class]="'text-' + member.color">{{ member.name }}</h4>
                  <p class="fw-medium mb-3" [class]="'text-' + member.color">{{ member.role }}</p>
                  <p class="text-secondary mb-0">{{ member.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact CTA -->
      <section class="cta-section py-5 text-white">
        <div class="container">
          <div class="row justify-content-center text-center">
            <div class="col-lg-8">
              <div class="d-flex align-items-center justify-content-center mb-4">
                <div class="cta-icon rounded-circle p-3 me-3">
                  <i class="material-icons text-white" style="font-size: 2.5rem;">rocket_launch</i>
                </div>
                <h2 class="display-5 fw-bold mb-0">Prêt à commencer ?</h2>
              </div>
              <p class="lead mb-4 opacity-75">Rejoignez notre communauté et découvrez la différence RéservPlus</p>
              <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <a routerLink="/register" class="btn btn-light btn-lg px-4 py-3 fw-semibold">
                  <i class="material-icons me-2">person_add</i>
                  Créer un compte
                </a>
                <a routerLink="/contact" class="btn btn-outline-light btn-lg px-4 py-3 fw-semibold">
                  <i class="material-icons me-2">contact_support</i>
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .card {
      transition: all 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
    }
    
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .hero-icon {
      background: rgba(255, 255, 255, 0.2);
    }
    
    /* Story Card */
    .story-card {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    /* Stat Icons */
    .stat-icon-1 {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .stat-icon-2 {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .stat-icon-3 {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .stat-icon-4 {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
    
    /* Value Icons */
    .value-icon-1 {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }
    
    .value-icon-2 {
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    }
    
    .value-icon-3 {
      background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    }
    
    .value-icon-4 {
      background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    }
    
    /* Team Icons */
    .team-icon-1 {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .team-icon-2 {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .team-icon-3 {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .cta-icon {
      background: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class AboutComponent {
  
  teamMembers = [
    {
      name: 'Marie Dupont',
      role: 'Directrice Générale',
      description: 'Experte en gestion de services avec plus de 10 ans d\'expérience dans le secteur.',
      icon: 'business',
      color: 'primary'
    },
    {
      name: 'Jean Martin',
      role: 'Directeur Technique',
      description: 'Spécialiste en développement web et architecture de solutions.',
      icon: 'code',
      color: 'success'
    },
    {
      name: 'Sophie Bernard',
      role: 'Responsable Client',
      description: 'Passionnée par l\'expérience utilisateur et la satisfaction client.',
      icon: 'support_agent',
      color: 'info'
    }
  ];

  stats = [
    { number: '500+', label: 'Utilisateurs satisfaits', icon: 'people', color: 'primary' },
    { number: '50+', label: 'Prestataires partenaires', icon: 'business', color: 'success' },
    { number: '1000+', label: 'Réservations traitées', icon: 'event', color: 'info' },
    { number: '24/7', label: 'Support client', icon: 'support_agent', color: 'warning' }
  ];

  values = [
    {
      title: 'Excellence',
      description: 'Nous nous engageons à fournir un service de qualité supérieure à chaque interaction.',
      icon: 'star',
      color: 'warning'
    },
    {
      title: 'Innovation',
      description: 'Nous développons constamment de nouvelles solutions pour améliorer votre expérience.',
      icon: 'lightbulb',
      color: 'info'
    },
    {
      title: 'Confiance',
      description: 'La sécurité et la confidentialité de vos données sont notre priorité absolue.',
      icon: 'security',
      color: 'success'
    },
    {
      title: 'Accessibilité',
      description: 'Notre plateforme est conçue pour être accessible à tous, partout, tout le temps.',
      icon: 'accessibility',
      color: 'primary'
    }
  ];
} 