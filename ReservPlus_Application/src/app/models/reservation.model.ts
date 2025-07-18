export interface Reservation {
  id: number;
  userId: number;
  prestataireId: number;
  disponibiliteId: number;
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  statut: ReservationStatut;
  montant: number;
  commentaire?: string;
  dateCreation: string;
  dateModification?: string;
  
  // Propriétés de navigation (optionnelles)
  user?: User;
  prestataire?: Prestataire;
  disponibilite?: Disponibilite;
}

export enum ReservationStatut {
  EnAttente = 'En attente',
  Confirmee = 'Confirmée',
  Annulee = 'Annulée',
  Terminee = 'Terminée',
  AnnuleeParPrestataire = 'Annulée par prestataire'
}

export interface CreateReservationRequest {
  userId: number;
  prestataireId: number;
  disponibiliteId: number;
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  commentaire?: string;
}

export interface UpdateReservationRequest {
  statut?: ReservationStatut;
  commentaire?: string;
}

// Interfaces pour les propriétés de navigation
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
}

export interface Prestataire {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  telephone?: string;
}

export interface Disponibilite {
  id: number;
  prestataireId: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  disponible: boolean;
} 