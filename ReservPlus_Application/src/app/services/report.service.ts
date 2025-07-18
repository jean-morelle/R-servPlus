import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Report, 
  ReportParametres, 
  ReportResultat,
  StatistiquesReservations,
  StatistiquesPrestataires,
  StatistiquesUtilisateurs,
  StatistiquesPaiements
} from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly baseUrl = 'https://localhost:7195/api';

  constructor(private http: HttpClient) {}

  // Rapports généraux
  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/reports`);
  }

  getReport(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.baseUrl}/reports/${id}`);
  }

  createReport(report: Partial<Report>): Observable<Report> {
    return this.http.post<Report>(`${this.baseUrl}/reports`, report);
  }

  updateReport(id: number, report: Partial<Report>): Observable<Report> {
    return this.http.put<Report>(`${this.baseUrl}/reports/${id}`, report);
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reports/${id}`);
  }

  executeReport(id: number, parametres?: ReportParametres): Observable<ReportResultat> {
    return this.http.post<ReportResultat>(`${this.baseUrl}/reports/${id}/execute`, parametres);
  }

  // Statistiques spécifiques
  getStatistiquesReservations(parametres?: ReportParametres): Observable<StatistiquesReservations> {
    return this.http.get<StatistiquesReservations>(`${this.baseUrl}/reports/statistiques/reservations`, { params: parametres as any });
  }

  getStatistiquesPrestataires(parametres?: ReportParametres): Observable<StatistiquesPrestataires> {
    return this.http.get<StatistiquesPrestataires>(`${this.baseUrl}/reports/statistiques/prestataires`, { params: parametres as any });
  }

  getStatistiquesUtilisateurs(parametres?: ReportParametres): Observable<StatistiquesUtilisateurs> {
    return this.http.get<StatistiquesUtilisateurs>(`${this.baseUrl}/reports/statistiques/utilisateurs`, { params: parametres as any });
  }

  getStatistiquesPaiements(parametres?: ReportParametres): Observable<StatistiquesPaiements> {
    return this.http.get<StatistiquesPaiements>(`${this.baseUrl}/reports/statistiques/paiements`, { params: parametres as any });
  }

  // Rapports prédéfinis
  getRapportReservationsParPeriode(parametres: ReportParametres): Observable<ReportResultat> {
    return this.http.post<ReportResultat>(`${this.baseUrl}/reports/reservations-periode`, parametres);
  }

  getRapportRevenusParPrestataire(parametres: ReportParametres): Observable<ReportResultat> {
    return this.http.post<ReportResultat>(`${this.baseUrl}/reports/revenus-prestataire`, parametres);
  }

  getRapportDisponibilitesUtilisees(parametres: ReportParametres): Observable<ReportResultat> {
    return this.http.post<ReportResultat>(`${this.baseUrl}/reports/disponibilites-utilisees`, parametres);
  }

  getRapportPaiementsParStatut(parametres: ReportParametres): Observable<ReportResultat> {
    return this.http.post<ReportResultat>(`${this.baseUrl}/reports/paiements-statut`, parametres);
  }

  getRapportUtilisateursActifs(parametres: ReportParametres): Observable<ReportResultat> {
    return this.http.post<ReportResultat>(`${this.baseUrl}/reports/utilisateurs-actifs`, parametres);
  }

  getRapportPerformancePrestataires(parametres: ReportParametres): Observable<ReportResultat> {
    return this.http.post<ReportResultat>(`${this.baseUrl}/reports/performance-prestataires`, parametres);
  }

  getRapportTendancesMensuelles(parametres: ReportParametres): Observable<ReportResultat> {
    return this.http.post<ReportResultat>(`${this.baseUrl}/reports/tendances-mensuelles`, parametres);
  }

  getRapportComplet(parametres: ReportParametres): Observable<ReportResultat> {
    return this.http.post<ReportResultat>(`${this.baseUrl}/reports/rapport-complet`, parametres);
  }

  // Export de données
  exportReport(id: number, format: string, parametres?: ReportParametres): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/reports/${id}/export`, parametres, {
      responseType: 'blob',
      params: { format }
    });
  }

  exportStatistiques(format: string, parametres?: ReportParametres): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/reports/export-statistiques`, parametres, {
      responseType: 'blob',
      params: { format }
    });
  }

  // Méthodes utilitaires pour les graphiques
  generateChartData(data: any[], type: string, labels: string[]): any {
    const colors = [
      '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8',
      '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#6c757d'
    ];

    return {
      type: type,
      labels: labels,
      datasets: [{
        label: 'Données',
        data: data,
        backgroundColor: type === 'pie' || type === 'doughnut' ? colors.slice(0, data.length) : colors[0],
        borderColor: type === 'line' ? colors[0] : colors.slice(0, data.length),
        borderWidth: 2,
        fill: type === 'line' ? false : undefined
      }],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: type !== 'pie' && type !== 'doughnut' ? {
          y: {
            beginAtZero: true
          }
        } : undefined
      }
    };
  }

  // Calculs de tendances
  calculateTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }

  calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  // Formatage des données pour l'affichage
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }
} 