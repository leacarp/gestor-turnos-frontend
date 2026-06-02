import { defineStore } from 'pinia'
import { ref } from 'vue'
import { availabilityService } from '@/services/availabilityService'
import type { AvailableSlot } from '@/types/availability'

export const useAvailabilityStore = defineStore('availability', () => {
  const availableSlots = ref<AvailableSlot[]>([])
  const isLoadingSlots = ref(false)
  const slotsError = ref<string | null>(null)
  
  let slotsRequestId = 0

  async function fetchAvailableSlots(providerId: string, serviceId: string, date: string) {
    const requestId = ++slotsRequestId
    isLoadingSlots.value = true
    slotsError.value = null
    availableSlots.value = []

    try {
      const { data } = await availabilityService.getAvailableSlots(
        providerId,
        serviceId,
        date,
      )

      if (requestId === slotsRequestId) {
        availableSlots.value = data
      }
    } catch (error) {
      if (requestId === slotsRequestId) {
        slotsError.value = 'No pudimos cargar los horarios disponibles'
      }
      console.error('[useAvailabilityStore] fetchAvailableSlots', error)
      throw error // Re-throw to handle it in views if needed
    } finally {
      if (requestId === slotsRequestId) {
        isLoadingSlots.value = false
      }
    }
  }

  function clearSlots() {
    availableSlots.value = []
    slotsError.value = null
  }

  return {
    availableSlots,
    isLoadingSlots,
    slotsError,
    fetchAvailableSlots,
    clearSlots,
  }
})
