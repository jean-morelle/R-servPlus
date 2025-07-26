import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, UserInfo, AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:5266/api';
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    
    if (token && user) {
      try {
        const userInfo: UserInfo = JSON.parse(user);
        this.authStateSubject.next({
          isAuthenticated: true,
          user: userInfo,
          token: token,
          loading: false,
          error: null
        });
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap({
        next: (response) => {
          this.setAuth(response.token, response.user);
          this.setLoading(false);
        },
        error: (error) => {
          this.setError('Erreur de connexion: ' + (error.error?.message || 'Identifiants invalides'));
          this.setLoading(false);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    this.setLoading(true);
    
    return this.http.post(`${this.baseUrl}/auth/register`, userData).pipe(
      tap({
        next: () => {
          this.setLoading(false);
        },
        error: (error) => {
          this.setError('Erreur d\'inscription: ' + (error.error?.message || 'Erreur lors de l\'inscription'));
          this.setLoading(false);
        }
      })
    );
  }

  logout(): void {
    this.clearAuth();
  }

  private setAuth(token: string, user: UserInfo): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    this.authStateSubject.next({
      isAuthenticated: true,
      user: user,
      token: token,
      loading: false,
      error: null
    });
  }

  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
  }

  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      loading: loading
    });
  }

  private setError(error: string): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      error: error
    });
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUser(): UserInfo | null {
    return this.authStateSubject.value.user;
  }

  clearError(): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      error: null
    });
  }
} 