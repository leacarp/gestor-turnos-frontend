// src/services/pagosService.ts
// La "configuración de seña" del proveedor se almacena en providerData.minimumAdvance
// Endpoint: PUT /users/me  { providerData: { minimumAdvance: number } }
import { apiClient } from '@/lib/axios'
import type { UpdateMinimumAdvanceDto } from '@/types/pagos'
import type { CurrentUser } from '@/services/userService'

export const pagosService = {
  /** Actualiza el monto de seña global del proveedor */
  updateMinimumAdvance: (monto: number) => {
    const dto: UpdateMinimumAdvanceDto = {
      providerData: { minimumAdvance: monto },
    }
    return apiClient.put<CurrentUser>('/users/me', dto)
  },
}
