import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestataire, CreatePrestataireDto, UpdatePrestataireDto } from '../models/prestataire.model';

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {
  private readonly baseUrl = 'https://localhost:7195/api/prestataires';

  constructor(private http: HttpClient) { }

  getAllPrestataires(): Observable<Prestataire[]> {
    return this.http.get<Prestataire[]>(this.baseUrl);
  }

  getPrestataireById(id: number): Observable<Prestataire> {
    return this.http.get<Prestataire>(`${this.baseUrl}/${id}`);
  }

  createPrestataire(prestataire: CreatePrestataireDto): Observable<Prestataire> {
    return this.http.post<Prestataire>(this.baseUrl, prestataire);
  }

  updatePrestataire(id: number, prestataire: UpdatePrestataireDto): Observable<Prestataire> {
    return this.http.put<Prestataire>(`${this.baseUrl}/${id}`, prestataire);
  }

  deletePrestataire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPrestatairesBySpecialite(specialite: string): Observable<Prestataire[]> {
    return this.http.get<Prestataire[]>(`${this.baseUrl}/specialite/${specialite}`);
  }

  getPrestatairesActifs(): Observable<Prestataire[]> {
    return this.http.get<Prestataire[]>(`${this.baseUrl}/actifs`);
  }
} 