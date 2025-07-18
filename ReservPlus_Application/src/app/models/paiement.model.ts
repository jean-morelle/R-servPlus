export interface Paiement {
  id: number;
  montant: number;
  datePaiement: Date;
  methodePaiement: MethodePaiement;
  statut: StatutPaiement;
  reservationId: number;
  utilisateurId: number;
  userId?: number; // Alias for utilisateurId
  prestataireId?: number; // For compatibility with components
  utilisateur?: User;
  reservation?: Reservation;
}

export interface CreatePaiementDto {
  montant: number;
  methodePaiement: MethodePaiement;
  reservationId: number;
  utilisateurId: number;
  userId?: number; // Alias for utilisateurId
  prestataireId?: number; // For compatibility with components
}

export interface UpdatePaiementDto {
  montant?: number;
  datePaiement?: Date;
  methodePaiement?: MethodePaiement;
  statut?: StatutPaiement;
}

export enum MethodePaiement {
  CarteBancaire = 0,
  Especes = 1,
  Cheque = 2,
  Virement = 3
}

export enum StatutPaiement {
  EnAttente = 0,
  Valide = 1,
  Refuse = 2,
  Annule = 3
}

// Imports pour éviter les erreurs de référence circulaire
interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  dateInscription: Date;
  estActif: boolean;
}

interface Reservation {
  id: number;
  dateReservation: Date;
  heureDebut: string;
  heureFin: string;
  statut: string;
  utilisateurId: number;
  prestataireId: number;
  montant: number;
} 