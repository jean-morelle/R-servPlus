import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly _baseUrl = 'https://localhost:7195/api';

  constructor(private http: HttpClient) { }

  // Getter pour accéder à l'URL de base
  public get baseUrl(): string {
    return this._baseUrl;
  }

  // Headers avec token (pour plus tard)
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  // Méthodes HTTP génériques
  public get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this._baseUrl}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  public post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this._baseUrl}/${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  public put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this._baseUrl}/${endpoint}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  public delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this._baseUrl}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
    }
    
    console.error('Erreur API:', error);
    return throwError(() => new Error(errorMessage));
  }
} 