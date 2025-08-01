import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Prestataire, CreatePrestataireDto, UpdatePrestataireDto } from '../models/prestataire.model';

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {
  private readonly baseUrl = 'http://localhost:5266/api/prestataires';
  private useMockData = true; // Changez à false quand le backend est prêt

  constructor(private http: HttpClient) { }

  // Données mockées pour le développement
  private mockPrestataires: Prestataire[] = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      telephone: '0123456789',
      adresse: '123 Rue de la Paix',
              ville: 'Lomé',
      codePostal: '75001',
      specialite: 'Plomberie',
      description: 'Plombier expérimenté avec 10 ans d\'expérience. Spécialisé dans la réparation et l\'installation de systèmes de plomberie.',
      tarifHoraire: 45.0,
      dateInscription: new Date('2024-01-15'),
      estActif: true
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Marie',
      email: 'marie.martin@email.com',
      telephone: '0987654321',
      adresse: '456 Avenue des Champs',
      ville: 'Lyon',
      codePostal: '69001',
      specialite: 'Électricité',
      description: 'Électricienne qualifiée. Installation et maintenance électrique pour particuliers et entreprises.',
      tarifHoraire: 50.0,
      dateInscription: new Date('2024-01-20'),
      estActif: true
    },
    {
      id: 3,
      nom: 'Bernard',
      prenom: 'Pierre',
      email: 'pierre.bernard@email.com',
      telephone: '0555666777',
      adresse: '789 Boulevard Central',
      ville: 'Marseille',
      codePostal: '13001',
      specialite: 'Jardinage',
      description: 'Jardinier paysagiste. Création et entretien de jardins, terrasses et espaces verts.',
      tarifHoraire: 35.0,
      dateInscription: new Date('2024-02-01'),
      estActif: true
    },
    {
      id: 4,
      nom: 'Petit',
      prenom: 'Sophie',
      email: 'sophie.petit@email.com',
      telephone: '0444333222',
      adresse: '321 Rue du Commerce',
      ville: 'Toulouse',
      codePostal: '31000',
      specialite: 'Ménage',
      description: 'Femme de ménage professionnelle. Services de nettoyage régulier et ponctuel.',
      tarifHoraire: 25.0,
      dateInscription: new Date('2024-02-10'),
      estActif: false
    },
    {
      id: 5,
      nom: 'Moreau',
      prenom: 'Lucas',
      email: 'lucas.moreau@email.com',
      telephone: '0333222111',
      adresse: '654 Place de la République',
      ville: 'Nantes',
      codePostal: '44000',
      specialite: 'Peinture',
      description: 'Peintre en bâtiment. Peinture intérieure et extérieure, rénovation complète.',
      tarifHoraire: 40.0,
      dateInscription: new Date('2024-02-15'),
      estActif: true
    }
  ];

  getAllPrestataires(): Observable<Prestataire[]> {
    if (this.useMockData) {
      return of(this.mockPrestataires);
    }
    return this.http.get<Prestataire[]>(this.baseUrl);
  }

  getPrestataireById(id: number): Observable<Prestataire> {
    if (this.useMockData) {
      const prestataire = this.mockPrestataires.find(p => p.id === id);
      if (prestataire) {
        return of(prestataire);
      }
      throw new Error('Prestataire non trouvé');
    }
    return this.http.get<Prestataire>(`${this.baseUrl}/${id}`);
  }

  createPrestataire(prestataire: CreatePrestataireDto): Observable<Prestataire> {
    if (this.useMockData) {
      const newPrestataire: Prestataire = {
        ...prestataire,
        id: Math.max(...this.mockPrestataires.map(p => p.id)) + 1,
        dateInscription: new Date(),
        estActif: true
      };
      this.mockPrestataires.push(newPrestataire);
      return of(newPrestataire);
    }
    return this.http.post<Prestataire>(this.baseUrl, prestataire);
  }

  updatePrestataire(id: number, prestataire: UpdatePrestataireDto): Observable<Prestataire> {
    if (this.useMockData) {
      const index = this.mockPrestataires.findIndex(p => p.id === id);
      if (index !== -1) {
        this.mockPrestataires[index] = { ...this.mockPrestataires[index], ...prestataire };
        return of(this.mockPrestataires[index]);
      }
      throw new Error('Prestataire non trouvé');
    }
    return this.http.put<Prestataire>(`${this.baseUrl}/${id}`, prestataire);
  }

  deletePrestataire(id: number): Observable<void> {
    if (this.useMockData) {
      const index = this.mockPrestataires.findIndex(p => p.id === id);
      if (index !== -1) {
        this.mockPrestataires.splice(index, 1);
        return of(void 0);
      }
      throw new Error('Prestataire non trouvé');
    }
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPrestatairesBySpecialite(specialite: string): Observable<Prestataire[]> {
    if (this.useMockData) {
      const filtered = this.mockPrestataires.filter(p => p.specialite === specialite);
      return of(filtered);
    }
    return this.http.get<Prestataire[]>(`${this.baseUrl}/specialite/${specialite}`);
  }

  getPrestatairesActifs(): Observable<Prestataire[]> {
    if (this.useMockData) {
      const actifs = this.mockPrestataires.filter(p => p.estActif);
      return of(actifs);
    }
    return this.http.get<Prestataire[]>(`${this.baseUrl}/actifs`);
  }
} 