import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  
  teamMembers = [
    {
      name: 'Marie Dupont',
      role: 'Directrice Générale',
      description: 'Experte en gestion de services avec plus de 10 ans d\'expérience dans le secteur.',
      image: 'assets/images/team/marie.jpg'
    },
    {
      name: 'Jean Martin',
      role: 'Directeur Technique',
      description: 'Spécialiste en développement web et architecture de solutions.',
      image: 'assets/images/team/jean.jpg'
    },
    {
      name: 'Sophie Bernard',
      role: 'Responsable Client',
      description: 'Passionnée par l\'expérience utilisateur et la satisfaction client.',
      image: 'assets/images/team/sophie.jpg'
    }
  ];

  stats = [
    { number: '500+', label: 'Utilisateurs satisfaits' },
    { number: '50+', label: 'Prestataires partenaires' },
    { number: '1000+', label: 'Réservations traitées' },
    { number: '24/7', label: 'Support client' }
  ];

  values = [
    {
      title: 'Excellence',
      description: 'Nous nous engageons à fournir un service de qualité supérieure à chaque interaction.',
      icon: 'fas fa-star'
    },
    {
      title: 'Innovation',
      description: 'Nous développons constamment de nouvelles solutions pour améliorer votre expérience.',
      icon: 'fas fa-lightbulb'
    },
    {
      title: 'Confiance',
      description: 'La sécurité et la confidentialité de vos données sont notre priorité absolue.',
      icon: 'fas fa-shield-alt'
    },
    {
      title: 'Accessibilité',
      description: 'Notre plateforme est conçue pour être accessible à tous, partout, tout le temps.',
      icon: 'fas fa-universal-access'
    }
  ];
} 