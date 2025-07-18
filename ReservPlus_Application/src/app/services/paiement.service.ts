import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paiement, CreatePaiementDto, UpdatePaiementDto, MethodePaiement, StatutPaiement } from '../models/paiement.model';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private readonly baseUrl = 'https://localhost:7195/api/paiements';

  constructor(private http: HttpClient) { }

  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(this.baseUrl);
  }

  getPaiementById(id: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.baseUrl}/${id}`);
  }

  createPaiement(paiement: CreatePaiementDto): Observable<Paiement> {
    return this.http.post<Paiement>(this.baseUrl, paiement);
  }

  updatePaiement(id: number, paiement: UpdatePaiementDto): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.baseUrl}/${id}`, paiement);
  }

  deletePaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPaiementsByUtilisateur(utilisateurId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.baseUrl}/utilisateur/${utilisateurId}`);
  }

  getPaiementsByStatut(statut: StatutPaiement): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.baseUrl}/statut/${statut}`);
  }

  getPaiementsByMethode(methode: MethodePaiement): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.baseUrl}/methode/${methode}`);
  }

  validerPaiement(id: number): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.baseUrl}/${id}/valider`, {});
  }

  refuserPaiement(id: number): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.baseUrl}/${id}/refuser`, {});
  }
} 