import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicesService } from '@/services/servicesService'
import type { ServiceResponse, BookingService } from '@/types/services'

function mapServiceToBooking(service: ServiceResponse): BookingService {
  return {
    id: service.id,
    providerId: service.proveedorId,
    name: service.nombre,
    description: service.categoria,
    price: service.precio,
    duration: service.duracion,
    requiresDeposit: service.requiereSeña,
    depositAmount: service.montoSeña,
    category: service.categoria,
  }
}

export const useServicesStore = defineStore('services', () => {
  const services = ref<BookingService[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchServices(providerId: string) {
    isLoading.value = true
    error.value = null

    try {
      const { data } = await servicesService.getServicesByProvider(providerId)
      services.value = data.map(mapServiceToBooking)
    } catch (err) {
      error.value = 'No pudimos cargar los servicios'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    services,
    isLoading,
    error,
    fetchServices,
  }
})
