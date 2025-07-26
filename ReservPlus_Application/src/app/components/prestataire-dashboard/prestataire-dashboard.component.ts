import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';

interface Activity {
  type: 'reservation' | 'payment' | 'rating' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  completed: boolean;
  reward?: string;
}

@Component({
  selector: 'app-prestataire-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestataire-dashboard.component.html',
  styleUrls: ['./prestataire-dashboard.component.css']
})
export class PrestataireDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reservationsChart') reservationsChartRef!: ElementRef<HTMLCanvasElement>;
  
  revenueChart: Chart | null = null;
  reservationsChart: Chart | null = null;
  
  // Dashboard data
  totalRevenue = 0;
  totalReservations = 0;
  averageRating = 0;
  activeReservations = 0;
  completedReservations = 0;
  
  // Change indicators
  revenueChange = 12.5;
  reservationChange = 8.3;
  
  // Period selection
  selectedPeriod = 'month';
  selectedPerformancePeriod = 'month';
  
  // Performance metrics
  satisfactionRate = 94;
  averageResponseTime = 2.5;
  bookingRate = 87;
  loyalCustomers = 23;
  
  // Monthly data for charts
  monthlyRevenue: number[] = [];
  monthlyReservations: number[] = [];
  monthLabels: string[] = [];
  
  // Recent activities
  recentActivities: Activity[] = [];
  
  // Goals
  goals: Goal[] = [];
  
  // Math object for template
  Math = Math;

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadRecentActivities();
    this.loadGoals();
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  loadDashboardData(): void {
    // Mock data - replace with actual service calls
    this.totalRevenue = 12500;
    this.totalReservations = 45;
    this.averageRating = 4.5;
    this.activeReservations = 8;
    this.completedReservations = 37;
    
    this.monthlyRevenue = [1200, 1500, 1800, 2100, 1900, 2200, 2400, 2100, 1800, 1600, 1400, 1200];
    this.monthlyReservations = [5, 7, 9, 11, 8, 12, 14, 10, 7, 6, 5, 4];
    this.monthLabels = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
  }

  loadRecentActivities(): void {
    this.recentActivities = [
      {
        type: 'reservation',
        title: 'Nouvelle réservation',
        description: 'Réservation pour service de plomberie',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures ago
        amount: 120
      },
      {
        type: 'payment',
        title: 'Paiement reçu',
        description: 'Paiement pour service de jardinage',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 heures ago
        amount: 85
      },
      {
        type: 'rating',
        title: 'Nouvelle évaluation',
        description: '5 étoiles pour service de peinture',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 heures ago
      },
      {
        type: 'message',
        title: 'Message client',
        description: 'Demande de devis pour rénovation',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 heures ago
      }
    ];
  }

  loadGoals(): void {
    this.goals = [
      {
        id: 1,
        title: 'Atteindre 50 réservations',
        description: 'Objectif mensuel de réservations',
        icon: 'fas fa-calendar-check',
        progress: 90,
        completed: false,
        reward: 'Badge "Prestataire Pro"'
      },
      {
        id: 2,
        title: 'Maintenir 4.8+ étoiles',
        description: 'Note moyenne minimale',
        icon: 'fas fa-star',
        progress: 94,
        completed: true,
        reward: 'Promotion en vedette'
      },
      {
        id: 3,
        title: 'Répondre en moins de 2h',
        description: 'Temps de réponse moyen',
        icon: 'fas fa-clock',
        progress: 75,
        completed: false,
        reward: 'Badge "Réactif"'
      },
      {
        id: 4,
        title: 'Gagner 15 000€',
        description: 'Objectif de revenus mensuels',
        icon: 'fas fa-euro-sign',
        progress: 83,
        completed: false,
        reward: 'Commission réduite'
      }
    ];
  }

  initializeCharts(): void {
    this.createRevenueChart();
    this.createReservationsChart();
  }

  createRevenueChart(): void {
    if (!this.revenueChartRef) return;

    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.monthLabels,
        datasets: [{
          label: 'Revenus mensuels (€)',
          data: this.monthlyRevenue,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Évolution des revenus'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(tickValue: string | number) {
                return tickValue + ' €';
              }
            }
          }
        }
      }
    };

    this.revenueChart = new Chart(ctx, config);
  }

  createReservationsChart(): void {
    if (!this.reservationsChartRef) return;

    const ctx = this.reservationsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.monthLabels,
        datasets: [{
          label: 'Réservations mensuelles',
          data: this.monthlyReservations,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Nombre de réservations par mois'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    this.reservationsChart = new Chart(ctx, config);
  }

  // Méthodes pour l'interface
  refreshData(): void {
    this.loadDashboardData();
    this.loadRecentActivities();
    this.loadGoals();
    this.updateCharts();
  }

  exportData(): void {
    // Logique d'export des données
    console.log('Export des données du tableau de bord');
  }

  setPeriod(period: string): void {
    this.selectedPeriod = period;
    this.updateCharts();
  }

  viewAllActivity(): void {
    // Navigation vers la page d'activité complète
    console.log('Voir toute l\'activité');
  }

  getActivityIcon(type: string): string {
    const icons = {
      reservation: 'fas fa-calendar-plus',
      payment: 'fas fa-credit-card',
      rating: 'fas fa-star',
      message: 'fas fa-comment'
    };
    return icons[type as keyof typeof icons] || 'fas fa-info-circle';
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      return `${Math.floor(hours / 24)}j`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('filled');
    }
    
    if (hasHalfStar) {
      stars.push('half');
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }
    
    return stars;
  }

  getResponseTimePercentage(): number {
    // Convertir le temps de réponse en pourcentage (2h = 100%, 6h = 0%)
    const maxTime = 6;
    const percentage = Math.max(0, 100 - (this.averageResponseTime / maxTime) * 100);
    return Math.round(percentage);
  }

  getLoyalCustomersPercentage(): number {
    // Pourcentage basé sur un objectif de 30 clients fidèles
    const target = 30;
    return Math.min(100, Math.round((this.loyalCustomers / target) * 100));
  }

  updateCharts(): void {
    // Mettre à jour les graphiques selon la période sélectionnée
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.reservationsChart) {
      this.reservationsChart.destroy();
    }
    
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }
} 