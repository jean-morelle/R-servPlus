export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  dateInscription: string;
  telephone?: string;
  ville?: string;
  codePostal?: string;
  estActif?: boolean;
  role: string;
  reservations?: Reservation[];
}

export interface CreateUserDto {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
}

export interface UpdateUserDto {
  nom?: string;
  prenom?: string;
  email?: string;
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