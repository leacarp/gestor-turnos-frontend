export interface ServiceResponse {
  id: string
  nombre: string
  duracion: number
  precio: number
  proveedorId: string
  requiereSeña: boolean
  porcentajeSeña: number
  montoSeña: number
  createdAt: string
  categoria: string
}

export interface BookingService {
  id: string
  providerId: string
  name: string
  description: string
  price: number
  duration: number
  requiresDeposit: boolean
  depositAmount: number
  category: string
}
