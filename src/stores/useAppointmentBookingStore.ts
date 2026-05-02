import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BookingService {
  id: string
  name: string
  description: string
  price: number
  duration: number
  location: string
  /** Si el servicio requiere pagar una seña para confirmar el turno */
  requiresDeposit?: boolean
  /** Monto de la seña en la misma moneda que `price` */
  depositAmount?: number
}

export interface BookingGuestDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  notes?: string
}

export const useAppointmentBookingStore = defineStore('appointmentBooking', () => {
  // ── State ────────────────────────────────────────────────
  const selectedService  = ref<BookingService | null>(null)
  const selectedDate     = ref<string>('')   // ISO 8601 date string, e.g. '2024-10-12'
  const selectedTime     = ref<string>('')   // HH:MM format, e.g. '10:00'
  const guestDetails     = ref<BookingGuestDetails | null>(null)

  // ── Actions ──────────────────────────────────────────────
  function setService(service: BookingService) {
    selectedService.value = service
  }

  function setDateTime(date: string, time: string) {
    selectedDate.value = date
    selectedTime.value = time
  }

  function setGuestDetails(details: BookingGuestDetails) {
    guestDetails.value = details
  }

  function reset() {
    selectedService.value = null
    selectedDate.value    = ''
    selectedTime.value    = ''
    guestDetails.value    = null
  }

  return {
    selectedService,
    selectedDate,
    selectedTime,
    guestDetails,
    setService,
    setDateTime,
    setGuestDetails,
    reset,
  }
})
