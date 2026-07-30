import { apiClient } from '@/lib/axios'
import type { ServiceResponse } from '@/types/services'

export const servicesService = {
  getServices: () => apiClient.get<ServiceResponse[]>('/servicios'),

  getServicesByProvider: (providerId: string) =>
    apiClient.get<ServiceResponse[]>(`/servicios/proveedor/${providerId}`),
}
