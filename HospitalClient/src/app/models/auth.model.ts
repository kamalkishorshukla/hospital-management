export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  token: string;
  fullName: string;
  email: string;
  role: string;
}

export interface UserProfile {
  id?: number;
  fullName: string;
  email: string;
  role: string;
}
