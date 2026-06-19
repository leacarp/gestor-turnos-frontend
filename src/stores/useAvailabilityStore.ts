import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { availabilityService } from '@/services/availabilityService'
import { parseApiError } from '@/utils/parseApiError'
import type {
  DaySlotDto,
  WeeklyScheduleRequestDto,
  WeeklyScheduleResponseDto,
  AvailabilityExceptionResponseDto,
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
  const appointmentGap = ref<number>(0)
  const exceptions = ref<AvailabilityExceptionResponseDto[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isLoadingExceptions = ref(false)
  const isSavingException = ref(false)
  const error = ref<string | null>(null)

  const hasSchedule = computed(() => schedule.value !== null)

  async function fetchSchedule() {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await availabilityService.getSchedule()
      schedule.value = data
      slots.value = data.slots
      appointmentGap.value = data.appointmentGap ?? 0
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
      appointmentGap.value = data.appointmentGap ?? 0
      return data
    } catch (err) {
      error.value = parseApiError(err, 'Error al guardar los horarios')
      console.error('[useAvailabilityStore] saveSchedule', err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function fetchExceptionsByMonth(year: number, month: number) {
    isLoadingExceptions.value = true
    try {
      const { data } = await availabilityService.getExceptionsByMonth(year, month)
      exceptions.value = data
    } catch (err) {
      console.error('[useAvailabilityStore] fetchExceptionsByMonth', err)
    } finally {
      isLoadingExceptions.value = false
    }
  }

  async function addException(date: string, reason?: string) {
    isSavingException.value = true
    try {
      const { data } = await availabilityService.createException({
        date,
        type: 'day_off',
        reason,
      })
      exceptions.value.push(data)
      exceptions.value.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
      return data
    } catch (err) {
      throw parseApiError(err, 'Error al guardar el feriado')
    } finally {
      isSavingException.value = false
    }
  }

  async function removeException(exceptionId: string) {
    try {
      await availabilityService.deleteException(exceptionId)
      exceptions.value = exceptions.value.filter((e) => e.id !== exceptionId)
    } catch (err) {
      throw parseApiError(err, 'Error al eliminar el feriado')
    }
  }

  return {
    schedule,
    slots,
    appointmentGap,
    exceptions,
    isLoading,
    isSaving,
    isLoadingExceptions,
    isSavingException,
    error,
    hasSchedule,
    fetchSchedule,
    saveSchedule,
    fetchExceptionsByMonth,
    addException,
    removeException,
  }
})
