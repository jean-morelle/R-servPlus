export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
  expiresAt: string;
}

export interface UserInfo {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  nom: string;
  prenom: string;
  motDePasse: string;
  confirmerMotDePasse: string;
  telephone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  error: string | null;
} 