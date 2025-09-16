// API Response types for authentication endpoints

export interface AuthApiResponse {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}