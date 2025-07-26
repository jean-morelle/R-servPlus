import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prestataire, PrestataireStats, Review } from '../../models/prestataire.model';
import { PrestataireService } from '../../services/prestataire.service';

@Component({
  selector: 'app-prestataire-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestataire-details.component.html',
  styleUrls: ['./prestataire-details.component.css']
})
export class PrestataireDetailsComponent implements OnInit {
  @Input() prestataireId?: number;
  
  prestataire: Prestataire | null = null;
  stats: PrestataireStats = {
    total: 0,
    active: 0,
    inactive: 0,
    averageRating: 0,
    totalReservations: 0,
    heuresTotal: 0,
    revenusTotal: 0,
    rating: 0,
    reviewCount: 0
  };
  reviews: Review[] = [];
  loading = false;
  error = '';
  
  // Properties for rating display
  rating = 4.5;
  reviewCount = 12;
  sectorAverage = 45.0;

  constructor(private prestataireService: PrestataireService) { }

  ngOnInit(): void {
    if (this.prestataireId) {
      this.loadPrestataire();
    }
  }

  loadPrestataire(): void {
    if (!this.prestataireId) return;
    
    this.loading = true;
    this.error = '';

    this.prestataireService.getPrestataireById(this.prestataireId).subscribe({
      next: (data) => {
        this.prestataire = data;
        this.loadStats();
        this.loadReviews();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du prestataire';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  loadStats(): void {
    if (!this.prestataireId) return;
    
    // Mock data for now - replace with actual service call
    this.stats = {
      total: 1,
      active: 1,
      inactive: 0,
      averageRating: 4.5,
      totalReservations: 45,
      heuresTotal: 120,
      revenusTotal: 5400,
      rating: 4.5,
      reviewCount: 12
    };
  }

  loadReviews(): void {
    if (!this.prestataireId) return;
    
    // Mock data for now - replace with actual service call
    this.reviews = [
      {
        id: 1,
        clientName: 'Jean Dupont',
        rating: 5,
        comment: 'Excellent service, très professionnel',
        date: new Date('2024-01-15')
      },
      {
        id: 2,
        clientName: 'Marie Martin',
        rating: 4,
        comment: 'Bon travail, ponctuel',
        date: new Date('2024-01-10')
      }
    ];
  }

  // Rating helper methods
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  // Utility methods
  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRME': return 'status-confirmed';
      case 'EN_ATTENTE': return 'status-pending';
      case 'ANNULE': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  getSectorAverage(): number {
    return this.sectorAverage;
  }

  // Action methods
  createReservation(): void {
    console.log('Créer une réservation');
    // Implement navigation to reservation form
  }

  sendMessage(): void {
    console.log('Envoyer un message');
    // Implement messaging functionality
  }

  viewSchedule(): void {
    console.log('Voir le planning');
    // Implement schedule view
  }

  exportData(): void {
    console.log('Exporter les données');
    // Implement data export
  }
} 