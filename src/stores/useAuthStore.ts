import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { AUTH_TOKEN_KEY } from '@/lib/axios'
import type { LoginDto, RegisterDto, AuthResponse, AuthUser } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(AUTH_TOKEN_KEY))
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
    localStorage.removeItem(AUTH_TOKEN_KEY)
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
  }
})
