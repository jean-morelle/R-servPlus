export interface Report {
  id: number;
  titre: string;
  description: string;
  type: ReportType;
  parametres: ReportParametres;
  dateCreation: string;
  dateDerniereExecution?: string;
  statut: ReportStatut;
  resultats?: any;
}

export enum ReportType {
  ReservationsParPeriode = 'reservations_periode',
  RevenusParPrestataire = 'revenus_prestataire',
  DisponibilitesUtilisees = 'disponibilites_utilisees',
  PaiementsParStatut = 'paiements_statut',
  UtilisateursActifs = 'utilisateurs_actifs',
  PerformancePrestataires = 'performance_prestataires',
  TendancesMensuelles = 'tendances_mensuelles',
  RapportComplet = 'rapport_complet'
}

export enum ReportStatut {
  EnPreparation = 'en_preparation',
  EnCours = 'en_cours',
  Termine = 'termine',
  Erreur = 'erreur'
}

export interface ReportParametres {
  dateDebut?: string;
  dateFin?: string;
  prestataireIds?: number[];
  userIds?: number[];
  statuts?: string[];
  groupBy?: string;
  format?: 'json' | 'csv' | 'pdf' | 'excel';
}

export interface ReportResultat {
  donnees: any[];
  total: number;
  moyenne?: number;
  pourcentage?: number;
  tendance?: 'up' | 'down' | 'stable';
  graphiques?: ChartData[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  labels: string[];
  datasets: ChartDataset[];
  options?: any;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  fill?: boolean;
}

// Statistiques spécifiques
export interface StatistiquesReservations {
  totalReservations: number;
  reservationsConfirmees: number;
  reservationsAnnulees: number;
  reservationsTerminees: number;
  tauxConfirmation: number;
  tauxAnnulation: number;
  revenusTotaux: number;
  revenusMoyens: number;
  reservationsParJour: { date: string; count: number }[];
  reservationsParPrestataire: { prestataire: string; count: number; revenus: number }[];
}

export interface StatistiquesPrestataires {
  totalPrestataires: number;
  prestatairesActifs: number;
  prestatairesInactifs: number;
  disponibilitesTotales: number;
  disponibilitesUtilisees: number;
  tauxUtilisation: number;
  performanceParPrestataire: {
    prestataire: string;
    reservations: number;
    revenus: number;
    tauxConfirmation: number;
    noteMoyenne: number;
  }[];
}

export interface StatistiquesUtilisateurs {
  totalUtilisateurs: number;
  utilisateursActifs: number;
  nouveauxUtilisateurs: number;
  reservationsParUtilisateur: { utilisateur: string; count: number; montant: number }[];
  activiteParMois: { mois: string; nouveaux: number; actifs: number }[];
}

export interface StatistiquesPaiements {
  totalPaiements: number;
  paiementsValides: number;
  paiementsEnAttente: number;
  paiementsRefuses: number;
  montantTotal: number;
  montantMoyen: number;
  paiementsParMethode: { methode: string; count: number; montant: number }[];
  paiementsParMois: { mois: string; count: number; montant: number }[];
} 