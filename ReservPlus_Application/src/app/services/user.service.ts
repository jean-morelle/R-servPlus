import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:5266/api';

  constructor(private http: HttpClient) { }

  // Obtenir tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/Users`);
  }

  // Obtenir un utilisateur par ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/Users/${id}`);
  }

  // Obtenir un utilisateur par email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/Users/email/${email}`);
  }

  // Créer un nouvel utilisateur
  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/Users`, user);
  }

  // Mettre à jour un utilisateur
  updateUser(id: string, user: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/Users/${id}`, user);
  }

  // Supprimer un utilisateur
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Users/${id}`);
  }

  // Rechercher des utilisateurs par nom
  searchUsers(nom: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/Users/search?nom=${encodeURIComponent(nom)}`);
  }

  // Vérifier si un email existe
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/Users/check-email?email=${encodeURIComponent(email)}`);
  }
} 