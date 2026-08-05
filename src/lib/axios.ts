import axios from 'axios'
import { AUTH_TOKEN_KEY, clearToken } from './token'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://gestor-turnos-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Un token puede vencer estando el usuario parado en una vista, no solo al
 * navegar. Ahí el guard del router ya pasó, así que el 401 es el único aviso:
 * cerramos sesión y mandamos a login.
 *
 * Los imports son dinámicos a propósito: axios.ts lo importan los services, que
 * a su vez los importan las vistas que carga el router. Importar el router acá
 * de forma estática armaría un ciclo.
 */
async function cerrarSesionYRedirigir(): Promise<void> {
  const [{ default: router }, { useAuthStore }] = await Promise.all([
    import('@/router'),
    import('@/stores/useAuthStore'),
  ])

  useAuthStore().logout()

  const actual = router.currentRoute.value

  // Si la ruta no requiere sesión no hay a dónde patear: puede ser el login con
  // credenciales mal puestas, o el flujo público de reserva de un invitado.
  if (!actual.matched.some((r) => r.meta.requiresAuth)) return

  await router.push({
    name: 'login',
    query: { redirect: actual.fullPath, expired: '1' },
  })
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      clearToken()
      await cerrarSesionYRedirigir()
    }
    return Promise.reject(error)
  },
)

export { AUTH_TOKEN_KEY }
