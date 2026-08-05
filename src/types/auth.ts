// Espeja ../gestor-turnos-backend/src/auth/presentation/dtos/

/** Roles aceptados por RegisterRequestDto (@IsEnum) */
export type UserRole = 'provider' | 'user' | 'client' | 'admin'

export interface LoginDto {
  email: string
  password: string
}

export interface SocialMediaDto {
  platform: string
  url: string
}

export interface ProviderDataDto {
  address: string
  serviceType: string
  publicInfo?: string
  socialMedia?: SocialMediaDto[]
  mpConnected?: boolean
}

export interface RegisterDto {
  name: string
  email: string
  phone: string
  password: string
  role?: UserRole
  providerData?: ProviderDataDto
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

/** Respuesta de GET /auth/profile */
export interface AuthProfile {
  id: string
  email: string
  role: string
}
