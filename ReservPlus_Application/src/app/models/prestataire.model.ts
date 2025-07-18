export interface Prestataire {
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

export interface CreatePrestataireDto {
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
}

export interface UpdatePrestataireDto {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  specialite?: string;
  description?: string;
  tarifHoraire?: number;
  estActif?: boolean;
} 