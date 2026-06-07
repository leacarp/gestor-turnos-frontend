import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { availabilityService } from '@/services/availabilityService'
import { parseApiError } from '@/utils/parseApiError'
import type {
  DaySlotDto,
  WeeklyScheduleRequestDto,
  WeeklyScheduleResponseDto,
} from '@/types/availability'

function isNotFoundError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    (err as { response?: { status?: number } }).response?.status === 404
  )
}

export const useAvailabilityStore = defineStore('availability', () => {
  const schedule = ref<WeeklyScheduleResponseDto | null>(null)
  const slots = ref<DaySlotDto[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  const hasSchedule = computed(() => schedule.value !== null)

  async function fetchSchedule() {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await availabilityService.getSchedule()
      schedule.value = data
      slots.value = data.slots
    } catch (err) {
      if (isNotFoundError(err)) {
        schedule.value = null
        slots.value = []
        return
      }

      error.value = parseApiError(err, 'Error al cargar los horarios')
      console.error('[useAvailabilityStore] fetchSchedule', err)
    } finally {
      isLoading.value = false
    }
  }

  async function saveSchedule(dto: WeeklyScheduleRequestDto) {
    isSaving.value = true
    error.value = null
    try {
      const { data } = hasSchedule.value
        ? await availabilityService.updateSchedule(dto)
        : await availabilityService.createSchedule(dto)

      schedule.value = data
      slots.value = data.slots
      return data
    } catch (err) {
      error.value = parseApiError(err, 'Error al guardar los horarios')
      console.error('[useAvailabilityStore] saveSchedule', err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  return {
    schedule,
    slots,
    isLoading,
    isSaving,
    error,
    hasSchedule,
    fetchSchedule,
    saveSchedule,
  }
})
