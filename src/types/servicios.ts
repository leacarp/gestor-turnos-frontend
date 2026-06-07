// Frontend types (English). API wire format is mapped in serviciosService.ts

export interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  providerId: string
  category: string
  createdAt: string
  requiereSeña?: boolean
  porcentajeSeña?: number
  montoSeña?: number
}

export interface CreateServiceDto {
  name: string
  description: string
  duration: number
  price: number
  category: string
}

export interface UpdateServiceDto {
  name?: string
  description?: string
  duration?: number
  price?: number
  category?: string
  requiereSeña?: boolean
  montoSeña?: number
}

/**
 * Global deposit from providerData.minimumAdvance.
 * It is always treated as a fixed amount.
 */
export function computeDepositAmount(
  _price: number,
  minimumAdvance?: number,
): number | undefined {
  if (minimumAdvance == null || minimumAdvance <= 0) return undefined
  return minimumAdvance
}
