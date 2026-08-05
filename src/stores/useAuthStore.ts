import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { AUTH_TOKEN_KEY, clearToken, getValidToken } from '@/lib/token'
import type { LoginDto, RegisterDto, AuthResponse, AuthUser } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // getValidToken y no localStorage directo: un token vencido tiene que dejar
  // isAuthenticated en false, si no el store contradice al guard del router.
  const token = ref<string | null>(getValidToken())
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(dto: LoginDto) {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await authService.login(dto)
      _setSession(data)
    } catch (err: unknown) {
      error.value = _parseError(err, 'Credenciales inválidas')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(dto: RegisterDto) {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await authService.register(dto)
      _setSession(data)
    } catch (err: unknown) {
      error.value = _parseError(err, 'Error al crear la cuenta')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    clearToken()
  }

  /** Restaura user desde API si hay token pero se perdió el estado (ej. F5) */
  async function restoreSession(): Promise<boolean> {
    if (!token.value) return false
    if (user.value?.id) return true
    try {
      const { data } = await userService.getMe()
      user.value = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }
      return true
    } catch {
      logout()
      return false
    }
  }

  function _setSession(data: AuthResponse) {
    token.value = data.accessToken
    user.value = data.user
    localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken)
  }

  function _parseError(err: unknown, fallback: string): string {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: { data?: { message?: string | string[] } } }).response?.data
        ?.message === 'string'
    ) {
      return (err as { response: { data: { message: string } } }).response.data.message
    }
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      Array.isArray(
        (err as { response?: { data?: { message?: string[] } } }).response?.data?.message,
      )
    ) {
      const messages = (err as { response: { data: { message: string[] } } }).response.data.message
      return messages.join('. ')
    }
    return fallback
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    restoreSession,
  }
})
