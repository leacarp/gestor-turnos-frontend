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
}

/**
 * Global deposit from providerData.minimumAdvance.
 * - 1–100 → treated as % of service price
 * - > 100 → treated as fixed amount (legacy onboarding)
 */
export function computeDepositAmount(
  price: number,
  minimumAdvance?: number,
): number | undefined {
  if (minimumAdvance == null || minimumAdvance <= 0) return undefined
  if (minimumAdvance <= 100) {
    return Math.round((price * minimumAdvance) / 100)
  }
  return minimumAdvance
}

export function isDepositPercent(minimumAdvance?: number): boolean {
  return minimumAdvance != null && minimumAdvance > 0 && minimumAdvance <= 100
}
