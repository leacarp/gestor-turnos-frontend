import { apiClient } from '@/lib/axios'
import type { ProviderDataDto } from '@/types/auth'

export interface CurrentUser {
  id: string
  name: string
  email: string
  phone: string
  role: string
  providerData?: ProviderDataDto
}

/** @deprecated Usado por AppointmentDetailsView — migrar a CurrentUser */
export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export const userService = {
  getMe: () => apiClient.get<CurrentUser>('/users/me'),

  /** Mock legacy — AppointmentDetailsView */
  async getCurrentUserProfile(): Promise<{ data: UserProfile }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: 'usr_123',
            firstName: 'Alexander J.',
            lastName: 'Sterling',
            email: 'a.sterling@meridian-corp.com',
            phone: '+1 (555) 012-3456',
          },
        })
      }, 800)
    })
  },
}
