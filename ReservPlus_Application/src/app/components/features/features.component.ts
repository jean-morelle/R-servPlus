import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  
  features = [
    {
      id: 1,
      title: 'Gestion des Réservations',
      description: 'Créez, modifiez et annulez des réservations en quelques clics. Interface intuitive et calendrier interactif.',
      icon: 'fas fa-calendar-check',
      color: '#4CAF50',
      details: [
        'Calendrier interactif en temps réel',
        'Système de notifications automatiques',
        'Gestion des conflits de planning',
        'Historique complet des réservations'
      ]
    },
    {
      id: 2,
      title: 'Gestion des Prestataires',
      description: 'Gérez votre équipe de prestataires avec leurs spécialisations, disponibilités et performances.',
      icon: 'fas fa-users',
      color: '#2196F3',
      details: [
        'Profils détaillés des prestataires',
        'Gestion des spécialisations',
        'Planning des disponibilités',
        'Suivi des performances'
      ]
    },
    {
      id: 3,
      title: 'Système de Paiements',
      description: 'Intégration complète des paiements avec suivi des transactions et génération de factures.',
      icon: 'fas fa-credit-card',
      color: '#FF9800',
      details: [
        'Paiements sécurisés en ligne',
        'Génération automatique de factures',
        'Suivi des paiements en attente',
        'Rapports financiers détaillés'
      ]
    },
    {
      id: 4,
      title: 'Notifications Intelligentes',
      description: 'Système de notifications automatiques pour tenir informés clients et prestataires.',
      icon: 'fas fa-bell',
      color: '#9C27B0',
      details: [
        'Notifications par email et SMS',
        'Rappels automatiques',
        'Notifications de confirmation',
        'Alertes de modifications'
      ]
    },
    {
      id: 5,
      title: 'Rapports et Analytics',
      description: 'Analysez vos performances avec des rapports détaillés et des statistiques en temps réel.',
      icon: 'fas fa-chart-line',
      color: '#F44336',
      details: [
        'Tableaux de bord personnalisables',
        'Rapports de performance',
        'Statistiques en temps réel',
        'Export des données'
      ]
    },
    {
      id: 6,
      title: 'API et Intégrations',
      description: 'Connectez RéservPlus à vos outils existants grâce à notre API robuste.',
      icon: 'fas fa-plug',
      color: '#607D8B',
      details: [
        'API REST complète',
        'Intégrations tierces',
        'Webhooks personnalisables',
        'Documentation détaillée'
      ]
    }
  ];

  selectedFeature: any = null;

  selectFeature(feature: any) {
    this.selectedFeature = feature;
  }

  closeFeature() {
    this.selectedFeature = null;
  }
} 