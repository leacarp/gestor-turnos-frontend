import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BookingService } from '@/types/services'

export type { BookingService } from '@/types/services'

export interface BookingGuestDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  notes?: string
}

export const useAppointmentBookingStore = defineStore('appointmentBooking', () => {
  const selectedService = ref<BookingService | null>(null)
  const selectedDate = ref('')
  const selectedTime = ref('')
  const guestDetails = ref<BookingGuestDetails | null>(null)

  function setService(service: BookingService) {
    selectedService.value = service
    selectedDate.value = ''
    selectedTime.value = ''
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
    selectedDate.value = ''
    selectedTime.value = ''
    guestDetails.value = null
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
