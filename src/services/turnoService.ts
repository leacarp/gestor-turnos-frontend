import { apiClient } from '@/lib/axios'

export interface AgendaTurno {
  turnoId: string
  fecha: string
  horaInicio: string
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado'
  clienteNombre: string
  servicioNombre: string
  precio: number
}

export const turnoService = {
  getAgendaDia: async (proveedorId: string, fechaYmd: string): Promise<AgendaTurno[]> => {
    const { data } = await apiClient.get<AgendaTurno[]>(
      `/turnos/proveedor/${proveedorId}/agenda`,
      { params: { fecha: fechaYmd } },
    )
    return data
  },

  cancelarDia: async (proveedorId: string, fechaYmd: string) =>
    apiClient.patch(`/turnos/proveedor/${proveedorId}/cancelar-dia`, { fecha: fechaYmd }),

  actualizarEstado: async (turnoId: string, estado: string) =>
    apiClient.patch(`/turnos/${turnoId}`, { estado }),

  eliminar: async (turnoId: string) => apiClient.delete(`/turnos/${turnoId}`),
}
