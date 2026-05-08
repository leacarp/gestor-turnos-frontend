import type { BookingGuestDetails } from '@/stores/useAppointmentBookingStore'

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export const userService = {
  /**
   * Obtiene el perfil del usuario actual logueado.
   * TODO: Conectar con el endpoint real cuando esté listo.
   */
  async getCurrentUserProfile(): Promise<{ data: UserProfile }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: 'usr_123',
            firstName: 'Alexander J.',
            lastName: 'Sterling',
            email: 'a.sterling@meridian-corp.com',
            phone: '+1 (555) 012-3456'
          }
        })
      }, 800)
    })
  }
}
