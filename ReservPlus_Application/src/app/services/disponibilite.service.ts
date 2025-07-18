import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disponibilite, CreateDisponibiliteDto, UpdateDisponibiliteDto } from '../models/disponibilite.model';

@Injectable({
  providedIn: 'root'
})
export class DisponibiliteService {
  private readonly baseUrl = 'https://localhost:7195/api/disponibilites';

  constructor(private http: HttpClient) { }

  getAllDisponibilites(): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(this.baseUrl);
  }

  getDisponibiliteById(id: number): Observable<Disponibilite> {
    return this.http.get<Disponibilite>(`${this.baseUrl}/${id}`);
  }

  createDisponibilite(disponibilite: CreateDisponibiliteDto): Observable<Disponibilite> {
    return this.http.post<Disponibilite>(this.baseUrl, disponibilite);
  }

  updateDisponibilite(id: number, disponibilite: UpdateDisponibiliteDto): Observable<Disponibilite> {
    return this.http.put<Disponibilite>(`${this.baseUrl}/${id}`, disponibilite);
  }

  deleteDisponibilite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getDisponibilitesByPrestataire(prestataireId: number): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${this.baseUrl}/prestataire/${prestataireId}`);
  }

  getDisponibilitesByDate(date: Date): Observable<Disponibilite[]> {
    const dateStr = date.toISOString().split('T')[0];
    return this.http.get<Disponibilite[]>(`${this.baseUrl}/date/${dateStr}`);
  }

  getDisponibilitesDisponibles(): Observable<Disponibilite[]> {
    return this.http.get<Disponibilite[]>(`${this.baseUrl}/disponibles`);
  }
} 