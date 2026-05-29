import { defineStore } from 'pinia'
import { ref } from 'vue'
import { serviciosService } from '@/services/serviciosService'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/useAuthStore'
import { parseApiError } from '@/utils/parseApiError'
import type { Service, CreateServiceDto, UpdateServiceDto } from '@/types/servicios'

export const useServiciosStore = defineStore('servicios', () => {
  const items = ref<Service[]>([])
  const selected = ref<Service | null>(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)
  /** Global deposit: % (1–100) or fixed amount (>100, legacy) */
  const depositPercent = ref<number | undefined>(undefined)

  async function fetchDepositPercent() {
    try {
      const { data } = await userService.getMe()
      depositPercent.value = data.providerData?.minimumAdvance
    } catch (err) {
      console.error('[useServiciosStore] fetchDepositPercent', err)
    }
  }

  async function fetchAll() {
    const authStore = useAuthStore()
    const hasSession = await authStore.restoreSession()
    const providerId = authStore.user?.id

    if (!hasSession || !providerId) {
      error.value = 'No hay sesión activa'
      return
    }

    isLoading.value = true
    error.value = null
    try {
      await fetchDepositPercent()
      items.value = await serviciosService.getByProvider(providerId)
    } catch (err) {
      error.value = parseApiError(err, 'Error al cargar los servicios')
      console.error('[useServiciosStore] fetchAll', err)
    } finally {
      isLoading.value = false
    }
  }

  async function create(dto: CreateServiceDto) {
    isSaving.value = true
    error.value = null
    try {
      const created = await serviciosService.create(dto)
      items.value.push(created)
      return created
    } catch (err) {
      error.value = parseApiError(err, 'Error al crear el servicio')
      console.error('[useServiciosStore] create', err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function update(id: string, dto: UpdateServiceDto) {
    isSaving.value = true
    error.value = null
    try {
      const updated = await serviciosService.update(id, dto)
      const index = items.value.findIndex((s) => s.id === id)
      if (index !== -1) items.value[index] = updated
      return updated
    } catch (err) {
      error.value = parseApiError(err, 'Error al actualizar el servicio')
      console.error('[useServiciosStore] update', err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function remove(id: string) {
    isSaving.value = true
    error.value = null
    try {
      await serviciosService.remove(id)
      items.value = items.value.filter((s) => s.id !== id)
    } catch (err) {
      error.value = parseApiError(err, 'Error al eliminar el servicio')
      console.error('[useServiciosStore] remove', err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  return {
    items,
    selected,
    isLoading,
    isSaving,
    error,
    depositPercent,
    fetchAll,
    create,
    update,
    remove,
  }
})
