import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, CreateReservationRequest, UpdateReservationRequest } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly baseUrl = 'https://localhost:7195/api';

  constructor(private http: HttpClient) {}

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations`);
  }

  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/reservations/${id}`);
  }

  createReservation(reservation: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/reservations`, reservation);
  }

  updateReservation(id: number, reservation: UpdateReservationRequest): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/reservations/${id}`, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reservations/${id}`);
  }

  getReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations/user/${userId}`);
  }

  getReservationsByPrestataire(prestataireId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations/prestataire/${prestataireId}`);
  }

  confirmReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.baseUrl}/reservations/${id}/confirm`, {});
  }

  cancelReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.baseUrl}/reservations/${id}/cancel`, {});
  }

  completeReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.baseUrl}/reservations/${id}/complete`, {});
  }
} 