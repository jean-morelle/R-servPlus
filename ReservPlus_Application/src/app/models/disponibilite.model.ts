export interface Disponibilite {
  id: number;
  prestataireId: number;
  date: Date;
  heureDebut: string; // Format "HH:mm"
  heureFin: string; // Format "HH:mm"
  estDisponible: boolean;
  prestataire?: Prestataire;
}

export interface CreateDisponibiliteDto {
  prestataireId: number;
  date: Date;
  heureDebut: string;
  heureFin: string;
  estDisponible: boolean;
}

export interface UpdateDisponibiliteDto {
  date?: Date;
  heureDebut?: string;
  heureFin?: string;
  estDisponible?: boolean;
}

// Import pour éviter les erreurs de référence circulaire
interface Prestataire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  specialite: string;
  description: string;
  tarifHoraire: number;
  dateInscription: Date;
  estActif: boolean;
} 