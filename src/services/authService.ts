import { apiClient } from '@/lib/axios'
import type { LoginDto, RegisterDto, AuthResponse, AuthProfile } from '@/types/auth'

export const authService = {
  login: (dto: LoginDto) =>
    apiClient.post<AuthResponse>('/auth/login', dto),

  register: (dto: RegisterDto) =>
    apiClient.post<AuthResponse>('/auth/register', dto),

  getProfile: () =>
    apiClient.get<AuthProfile>('/auth/profile'),
}
