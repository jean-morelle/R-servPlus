import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { ReportParametres, StatistiquesReservations, StatistiquesPrestataires, StatistiquesUtilisateurs, StatistiquesPaiements } from '../../models/report.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ReportsComponent implements OnInit {
  // @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>; // This line is removed as per the new_code

  loading = false;
  errorMessage = '';
  activeTab = 'reservations';
  
  // Formulaires
  filterForm: FormGroup;
  
  // Données des statistiques
  statsReservations: StatistiquesReservations | null = null;
  statsPrestataires: StatistiquesPrestataires | null = null;
  statsUtilisateurs: StatistiquesUtilisateurs | null = null;
  statsPaiements: StatistiquesPaiements | null = null;

  // Graphiques
  chartData: any = null;
  chartOptions: any = {};

  // Périodes prédéfinies
  periodes = [
    { label: 'Aujourd\'hui', value: 'today' },
    { label: 'Cette semaine', value: 'week' },
    { label: 'Ce mois', value: 'month' },
    { label: 'Ce trimestre', value: 'quarter' },
    { label: 'Cette année', value: 'year' },
    { label: 'Personnalisé', value: 'custom' }
  ];

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      periode: ['month'],
      dateDebut: [''],
      dateFin: [''],
      groupBy: ['jour']
    });
  }

  ngOnInit(): void {
    this.loadAllStatistics();
    this.setupFormListeners();
  }

  setupFormListeners(): void {
    this.filterForm.get('periode')?.valueChanges.subscribe(periode => {
      if (periode !== 'custom') {
        this.updateDateRange(periode);
      }
    });
  }

  updateDateRange(periode: string): void {
    const now = new Date();
    let dateDebut = new Date();
    let dateFin = new Date();

    switch (periode) {
      case 'today':
        dateDebut = now;
        dateFin = now;
        break;
      case 'week':
        dateDebut.setDate(now.getDate() - 7);
        break;
      case 'month':
        dateDebut.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        dateDebut.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        dateDebut.setFullYear(now.getFullYear() - 1);
        break;
    }

    this.filterForm.patchValue({
      dateDebut: dateDebut.toISOString().split('T')[0],
      dateFin: dateFin.toISOString().split('T')[0]
    });
  }

  loadAllStatistics(): void {
    this.loading = true;
    this.errorMessage = '';

    const parametres = this.getFilterParametres();

    Promise.all([
      this.loadStatistiquesReservations(parametres),
      this.loadStatistiquesPrestataires(parametres),
      this.loadStatistiquesUtilisateurs(parametres),
      this.loadStatistiquesPaiements(parametres)
    ]).finally(() => {
      this.loading = false;
    });
  }

  private loadStatistiquesReservations(parametres: ReportParametres): Promise<void> {
    return new Promise((resolve) => {
      this.reportService.getStatistiquesReservations(parametres).subscribe({
        next: (stats) => {
          this.statsReservations = stats;
          if (this.activeTab === 'reservations') {
            this.updateChart();
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des statistiques de réservations:', error);
          resolve();
        }
      });
    });
  }

  private loadStatistiquesPrestataires(parametres: ReportParametres): Promise<void> {
    return new Promise((resolve) => {
      this.reportService.getStatistiquesPrestataires(parametres).subscribe({
        next: (stats) => {
          this.statsPrestataires = stats;
          if (this.activeTab === 'prestataires') {
            this.updateChart();
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des statistiques de prestataires:', error);
          resolve();
        }
      });
    });
  }

  private loadStatistiquesUtilisateurs(parametres: ReportParametres): Promise<void> {
    return new Promise((resolve) => {
      this.reportService.getStatistiquesUtilisateurs(parametres).subscribe({
        next: (stats) => {
          this.statsUtilisateurs = stats;
          if (this.activeTab === 'utilisateurs') {
            this.updateChart();
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des statistiques d\'utilisateurs:', error);
          resolve();
        }
      });
    });
  }

  private loadStatistiquesPaiements(parametres: ReportParametres): Promise<void> {
    return new Promise((resolve) => {
      this.reportService.getStatistiquesPaiements(parametres).subscribe({
        next: (stats) => {
          this.statsPaiements = stats;
          if (this.activeTab === 'paiements') {
            this.updateChart();
          }
          resolve();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des statistiques de paiements:', error);
          resolve();
        }
      });
    });
  }

  getFilterParametres(): ReportParametres {
    const formValue = this.filterForm.value;
    return {
      dateDebut: formValue.dateDebut,
      dateFin: formValue.dateFin,
      groupBy: formValue.groupBy
    };
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
    this.updateChart();
  }

  updateChart(): void {
    setTimeout(() => {
      switch (this.activeTab) {
        case 'reservations':
          this.updateReservationsChart();
          break;
        case 'prestataires':
          this.updatePrestatairesChart();
          break;
        case 'utilisateurs':
          this.updateUtilisateursChart();
          break;
        case 'paiements':
          this.updatePaiementsChart();
          break;
      }
    }, 100);
  }

  updateReservationsChart(): void {
    if (!this.statsReservations) return;

    const data = this.statsReservations.reservationsParJour;
    const labels = data.map(item => this.formatDate(item.date));
    const values = data.map(item => item.count);

    this.chartData = this.reportService.generateChartData(values, 'line', labels);
  }

  updatePrestatairesChart(): void {
    if (!this.statsPrestataires) return;

    const data = this.statsPrestataires.performanceParPrestataire;
    const labels = data.map(item => item.prestataire);
    const values = data.map(item => item.revenus);

    this.chartData = this.reportService.generateChartData(values, 'bar', labels);
  }

  updateUtilisateursChart(): void {
    if (!this.statsUtilisateurs) return;

    const data = this.statsUtilisateurs.activiteParMois;
    const labels = data.map(item => item.mois);
    const values = data.map(item => item.actifs);

    this.chartData = this.reportService.generateChartData(values, 'bar', labels);
  }

  updatePaiementsChart(): void {
    if (!this.statsPaiements) return;

    const data = this.statsPaiements.paiementsParMethode;
    const labels = data.map(item => item.methode);
    const values = data.map(item => item.count);

    this.chartData = this.reportService.generateChartData(values, 'pie', labels);
  }

  onFilterChange(): void {
    this.loadAllStatistics();
  }

  exportReport(format: string): void {
    const parametres = this.getFilterParametres();
    
    this.reportService.exportStatistiques(format, parametres).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport_${this.activeTab}_${new Date().toISOString().split('T')[0]}.${format}`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors de l\'export:', error);
        this.errorMessage = 'Erreur lors de l\'export du rapport';
      }
    });
  }

  // Méthodes utilitaires
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

  formatCurrency(amount: number): string {
    return this.reportService.formatCurrency(amount);
  }

  formatPercentage(value: number): string {
    return this.reportService.formatPercentage(value);
  }

  formatNumber(value: number): string {
    return this.reportService.formatNumber(value);
  }

  getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return 'fas fa-arrow-up text-success';
      case 'down': return 'fas fa-arrow-down text-danger';
      default: return 'fas fa-minus text-muted';
    }
  }

  getTrendClass(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-danger';
      default: return 'text-muted';
    }
  }
} 