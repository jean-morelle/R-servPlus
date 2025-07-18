export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  estActif?: boolean;
  dateInscription: string;
  reservations?: Reservation[];
}

export interface CreateUserDto {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  estActif?: boolean;
}

export interface UpdateUserDto {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  estActif?: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  serviceId: string;
  dateReservation: string;
  heureDebut: string;
  heureFin: string;
  statut: number;
  montantTotal: number;
  dateCreation: string;
  paiementId?: string;
  notes?: string;
} 