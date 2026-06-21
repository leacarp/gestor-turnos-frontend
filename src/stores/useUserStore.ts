import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '@/services/userService'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  async function fetchMe() {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await userService.getMe()
      user.value = data
    } catch (err) {
      error.value = 'Error al cargar los datos del usuario'
      console.error('[useUserStore]', err)
      clearUser()
    } finally {
      isLoading.value = false
    }
  }

  function clearUser() {
    user.value = null
    error.value = null
  }

  return { user, isLoading, error, isAuthenticated, fetchMe, clearUser }
})


