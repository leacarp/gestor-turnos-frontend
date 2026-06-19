// src/stores/usePagosStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pagosService } from '@/services/pagosService'
import { userService } from '@/services/userService'
import { parseApiError } from '@/utils/parseApiError'

export const usePagosStore = defineStore('pagos', () => {
  /** Monto de seña actual cargado desde el backend */
  const montoSeña = ref<number | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)
  const isDirty = ref(false)

  async function fetchMontoSeña() {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await userService.getMe()
      montoSeña.value = data.providerData?.minimumAdvance ?? null
      isDirty.value = false
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Error al cargar la configuración de pagos')
      console.error('[usePagosStore] fetchMontoSeña', err)
    } finally {
      isLoading.value = false
    }
  }

  async function saveMontoSeña(monto: number) {
    isSaving.value = true
    error.value = null
    try {
      const { data } = await pagosService.updateMinimumAdvance(monto)
      montoSeña.value = data.providerData?.minimumAdvance ?? monto
      isDirty.value = false
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Error al guardar el monto de seña')
      console.error('[usePagosStore] saveMontoSeña', err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  function markDirty() {
    isDirty.value = true
  }

  return {
    montoSeña,
    isLoading,
    isSaving,
    error,
    isDirty,
    fetchMontoSeña,
    saveMontoSeña,
    markDirty,
  }
})
