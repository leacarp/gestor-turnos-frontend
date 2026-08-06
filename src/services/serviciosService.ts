import { apiClient } from '@/lib/axios'
import type { Service, CreateServiceDto, UpdateServiceDto } from '@/types/servicios'

/** Raw API response (backend field names in Spanish) */
interface ServicioApi {
  id: string
  nombre: string
  duracion: number
  precio: number
  proveedorId: string
  categoria: string
  createdAt: string
  description?: string
  requiereSeña?: boolean
  montoSeña?: number
}

function toService(raw: ServicioApi): Service {
  return {
    id: raw.id,
    name: raw.nombre,
    description: raw.description ?? '',
    duration: raw.duracion,
    price: raw.precio,
    providerId: raw.proveedorId,
    category: raw.categoria,
    createdAt:
      typeof raw.createdAt === 'string'
        ? raw.createdAt
        : new Date(raw.createdAt).toISOString(),
    requiereSeña: raw.requiereSeña,
    montoSeña: raw.montoSeña,
  }
}

function toCreatePayload(dto: CreateServiceDto) {
  return {
    nombre: dto.name,
    description: dto.description,
    duracion: dto.duration,
    precio: dto.price,
    categoria: dto.category,
    requiereSeña: dto.requiereSeña,
    montoSeña: dto.montoSeña,
  }
}

function toUpdatePayload(dto: UpdateServiceDto) {
  const payload: Record<string, unknown> = {}
  if (dto.name !== undefined) payload.nombre = dto.name
  if (dto.description !== undefined) payload.description = dto.description
  if (dto.duration !== undefined) payload.duracion = dto.duration
  if (dto.price !== undefined) payload.precio = dto.price
  if (dto.category !== undefined) payload.categoria = dto.category
  if (dto.requiereSeña !== undefined) payload.requiereSeña = dto.requiereSeña
  if (dto.montoSeña !== undefined) payload.montoSeña = dto.montoSeña
  return payload
}

export const serviciosService = {
  getByProvider: async (providerId: string) => {
    const { data } = await apiClient.get<ServicioApi[]>(
      `/servicios/proveedor/${providerId}`,
    )
    return data.map(toService)
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ServicioApi>(`/servicios/${id}`)
    return toService(data)
  },

  create: async (dto: CreateServiceDto) => {
    const { data } = await apiClient.post<ServicioApi>(
      '/servicios',
      toCreatePayload(dto),
    )
    return toService(data)
  },

  update: async (id: string, dto: UpdateServiceDto) => {
    const { data } = await apiClient.patch<ServicioApi>(
      `/servicios/${id}`,
      toUpdatePayload(dto),
    )
    return toService(data)
  },

  remove: (id: string) => apiClient.delete<void>(`/servicios/${id}`),
}
