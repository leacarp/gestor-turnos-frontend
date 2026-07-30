import { apiClient } from '@/lib/axios'
import type { ProviderDataDto } from '@/types/auth'

export interface ReminderSettings {
  telegram: { enabled: boolean; t12h: boolean; t3h: boolean; chatId?: string }
  email: { enabled: boolean; t12h: boolean }
  messageTemplate: string
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  phone: string
  role: string
  providerData?: ProviderDataDto
  reminderSettings?: ReminderSettings
}

/** @deprecated Usado por AppointmentDetailsView — migrar a CurrentUser */
export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  phone?: string
  providerData?: {
    publicInfo?: string
    address?: string
    minimumAdvance?: number
    serviceType?: string
    socialMedia?: { platform: string; url: string }[]
  }
  reminderSettings?: ReminderSettings
}

export const userService = {
  getMe: () => apiClient.get<CurrentUser>('/users/me'),

  updateMe: (payload: UpdateUserPayload) =>
    apiClient.put<CurrentUser>('/users/me', payload),

  getPublicProfile: (id: string) =>
    apiClient.get<any>(`/users/profile/${id}`),

  updateReminderSettings: (settings: ReminderSettings) =>
    apiClient.put<CurrentUser>('/users/me', { reminderSettings: settings }),

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
