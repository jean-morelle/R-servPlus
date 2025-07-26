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
  noteMoyenne?: number;
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

export interface PrestataireFilters {
  searchTerm?: string;
  specialite?: string;
  ville?: string;
  tarifMin?: number;
  tarifMax?: number;
  estActif?: boolean;
}

export interface PrestataireSearchResult {
  prestataires: Prestataire[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface PrestataireStats {
  total: number;
  active: number;
  inactive: number;
  averageRating: number;
  totalReservations: number;
  heuresTotal: number;
  revenusTotal: number;
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: Date;
} 