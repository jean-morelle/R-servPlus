import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, CreateReservationRequest, UpdateReservationRequest } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly baseUrl = 'http://localhost:5266/api';

  constructor(private http: HttpClient) { }

  // Obtenir toutes les réservations
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations`);
  }

  // Obtenir une réservation par ID
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/reservations/${id}`);
  }

  // Obtenir les réservations d'un utilisateur
  getReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations/user/${userId}`);
  }

  // Obtenir les réservations d'un prestataire
  getReservationsByPrestataire(prestataireId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations/prestataire/${prestataireId}`);
  }

  // Créer une nouvelle réservation
  createReservation(reservation: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/reservations`, reservation);
  }

  // Mettre à jour une réservation
  updateReservation(id: number, reservation: UpdateReservationRequest): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/reservations/${id}`, reservation);
  }

  // Supprimer une réservation
  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/reservations/${id}`);
  }

  // Annuler une réservation
  cancelReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.baseUrl}/reservations/${id}/cancel`, {});
  }

  // Confirmer une réservation
  confirmReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.baseUrl}/reservations/${id}/confirm`, {});
  }

  // Terminer une réservation
  completeReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.baseUrl}/reservations/${id}/complete`, {});
  }
} 