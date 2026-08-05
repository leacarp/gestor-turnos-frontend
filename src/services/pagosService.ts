// src/services/pagosService.ts
// La "configuración de seña" del proveedor se almacena en providerData.minimumAdvance
// Endpoint: PUT /users/me  { providerData: { minimumAdvance: number } }
import { apiClient } from '@/lib/axios'
import type { 
  CreatePreferenceDto, 
  CreateGuestPreferenceDto, 
  PreferenceResponse 
} from '@/types/pagos'
import type { CurrentUser } from '@/services/userService'

export const pagosService = {
  /** Crea una preferencia de pago para usuarios logueados */
  createPreference: (dto: CreatePreferenceDto) => {
    return apiClient.post<PreferenceResponse>('/mercadopago/preference', dto)
  },

  /** Crea una preferencia de pago para invitados */
  createGuestPreference: (dto: CreateGuestPreferenceDto) => {
    return apiClient.post<PreferenceResponse>('/mercadopago/guest-preference', dto)
  },

  /** Obtiene la URL de OAuth para conectar la cuenta del proveedor con Mercado Pago */
  getOAuthConnectUrl: () => {
    return apiClient.get<{ url: string }>('/mercadopago/oauth/connect')
  }
}
