import { ref } from 'vue'
import type { BookingService } from '@/stores/useAppointmentBookingStore'

// Datos mock basados en el diseño
const MOCK_SERVICES: BookingService[] = [
  {
    id: 'svc-1',
    name: 'Corte Regular',
    description: 'Our signature haircut including consulting, precise styling, and premium finishing products.',
    duration: 30,
    price: 2000,
    location: 'Main Barbershop',
    isPopular: true
  },
  {
    id: 'svc-2',
    name: 'Corte y Barba',
    description: 'The complete grooming experience. Full haircut and professional beard sculpting with hot towel treatment.',
    duration: 45,
    price: 3500,
    location: 'Main Barbershop'
  },
  {
    id: 'svc-3',
    name: 'Tratamiento Capilar',
    description: 'Deep scalp therapy using essential oils and premium conditioners to revitalize hair health and promote growth.',
    duration: 20,
    price: 1500,
    location: 'Main Barbershop'
  },
  {
    id: 'svc-4',
    name: 'Afeitado Clásico',
    description: 'Traditional straight-razor shave with warm lather, hot towels, and soothing aftershave treatment.',
    duration: 25,
    price: 1800,
    location: 'Main Barbershop'
  }
]

export function useServices() {
  const services = ref<BookingService[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchServices() {
    isLoading.value = true
    error.value = null
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 800))
      services.value = MOCK_SERVICES
    } catch (e) {
      error.value = 'Error al cargar los servicios'
    } finally {
      isLoading.value = false
    }
  }

  return {
    services,
    isLoading,
    error,
    fetchServices
  }
}
