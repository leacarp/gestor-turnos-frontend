import { apiClient } from '@/lib/axios'

export interface CreateTurnoRequestDto {
  fecha: string
  horaInicio: string
  proveedorId: string
  servicioId: string
  cliente: {
    tipo: 'REGISTRADO'
    id: string
  }
  notas?: string
}

export interface CreateGuestTurnoRequestDto {
  fecha: string
  horaInicio: string
  proveedorId: string
  servicioId: string
  clienteDetails: {
    tipo: 'INVITADO'
    nombre?: string
    email?: string
    celular?: string
  }
  notas?: string
}

export interface TurnoResponseDto {
  id: string | number
  status: string
  // To be expanded as needed when integrating the real backend
}

export const bookingService = {
  createAppointment: (dto: CreateTurnoRequestDto) =>
    apiClient.post<TurnoResponseDto>('/turnos', dto),

  createGuestAppointment: (dto: CreateGuestTurnoRequestDto) =>
    apiClient.post<TurnoResponseDto>('/turnos/guest', dto),
}
