import type { LoginRequest, LoginResponse, SignupRequest } from '../types/auth';

const BASE_URL = 'http://localhost:8080/api/auth';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid email or password');
  }

  const data: LoginResponse = await response.json();
  return data;
}

export async function signup(request: SignupRequest): Promise<void> {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to create account');
  }
}