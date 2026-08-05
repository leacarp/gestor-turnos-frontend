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
  montoSeña?: number
}

export interface CreateServiceDto {
  name: string
  description: string
  duration: number
  price: number
  category: string
  requiereSeña?: boolean
  montoSeña?: number
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

