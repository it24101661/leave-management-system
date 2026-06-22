export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'EMPLOYEE' | 'MANAGER';
  message: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  role: 'EMPLOYEE' | 'MANAGER';
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: 'EMPLOYEE' | 'MANAGER';
  isActive: boolean;
}