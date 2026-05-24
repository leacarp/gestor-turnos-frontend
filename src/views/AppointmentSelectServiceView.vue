<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useServices } from '@/composables/useServices'
import { useAppointmentBookingStore } from '@/stores/useAppointmentBookingStore'
import type { BookingService } from '@/stores/useAppointmentBookingStore'
import ServiceCard from '@/components/booking/ServiceCard.vue'

const router = useRouter()
const bookingStore = useAppointmentBookingStore()
const { services, isLoading, error, fetchServices } = useServices()

onMounted(async () => {
  await fetchServices()
})

function handleServiceSelect(service: BookingService) {
  bookingStore.setService(service)
  router.push({ name: 'booking-schedule' })
}
</script>

<template>
  <div class="select-service-view">
    <header class="select-service-view__header">
      <h2 class="select-service-view__title">Servicios Disponibles</h2>
      <p class="select-service-view__subtitle">
        Experimentá un servicio premium adaptado a tu estilo. Seleccioná entre nuestros servicios exclusivos para comenzar tu reserva.
      </p>
    </header>

    <div v-if="isLoading" class="select-service-view__loading">
      <div class="select-service-view__spinner"></div>
      <p>Cargando servicios...</p>
    </div>

    <div v-else-if="error" class="select-service-view__error">
      <span class="material-symbols-outlined">error</span>
      <p>{{ error }}</p>
      <button @click="fetchServices" class="select-service-view__retry-btn">Reintentar</button>
    </div>

    <div v-else class="select-service-view__grid">
      <ServiceCard
        v-for="service in services"
        :key="service.id"
        :service="service"
        @select="handleServiceSelect"
      />
    </div>


  </div>
</template>

<style scoped>
.select-service-view {
  display: flex;
  flex-direction: column;
  padding: var(--space-12) var(--space-6);
  padding-bottom: 6rem;
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 768px) {
  .select-service-view {
    padding: var(--space-12) var(--space-12);
  }
}

/* ── Header ────────────────────────────────────────────── */
.select-service-view__header {
  margin-bottom: var(--space-12);
  max-width: 56rem; /* max-w-xl aprox si queremos limitar el texto */
}

.select-service-view__title {
  color: var(--color-primary);
  font-family: var(--font-family-headline);
  font-size: var(--font-size-display); /* 2.25rem = 36px */
  font-weight: 800; /* extrabold */
  letter-spacing: -0.05em; /* tracking-tighter */
  line-height: 1; /* leading-none */
  margin-bottom: var(--space-2);
}

.select-service-view__subtitle {
  color: var(--color-text-secondary); /* text-on-surface-variant */
  font-family: var(--font-family-body);
  font-size: var(--font-size-lg);
  max-width: 36rem; /* max-w-xl */
}

/* ── States ────────────────────────────────────────────── */
.select-service-view__loading,
.select-service-view__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) 0;
  color: var(--color-text-secondary);
  gap: var(--space-4);
  text-align: center;
}

.select-service-view__spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-surface-container-high);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.select-service-view__retry-btn {
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
}

.select-service-view__error .material-symbols-outlined {
  font-size: 3rem;
  color: var(--color-error);
}

/* ── Grid ──────────────────────────────────────────────── */
.select-service-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-8);
}

</style>
