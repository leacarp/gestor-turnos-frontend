import { apiClient } from '@/lib/axios'

export interface TurnoPorMes {
  mes: string
  cantidad: number
}

export interface ServicioPopular {
  nombre: string
  cantidad: number
}

export interface UltimoTurno {
  _id: string
  fecha: string
  horaInicio: string
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado'
  clienteNombre: string
  servicioNombre: string
  precio: number
}

export interface DashboardMetrics {
  turnosEsteMes: number
  variacionMensual: number | null
  tasaAsistencia: number
  ingresoEstimado: number
  turnosPorMes: TurnoPorMes[]
  serviciosMasPedidos: ServicioPopular[]
  ultimosTurnos: UltimoTurno[]
}

export interface ClienteProveedor {
  id: string
  name: string
  email: string
  phone: string
  turnosCount: number
  ultimoTurno: string | null
}

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const { data } = await apiClient.get<DashboardMetrics>('/dashboard/metrics')
    return data
  },

  getClientes: async (): Promise<ClienteProveedor[]> => {
    const { data } = await apiClient.get<ClienteProveedor[]>('/dashboard/clientes')
    return data
  },
}
