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
      <h2 class="select-service-view__title">Available Services</h2>
      <p class="select-service-view__subtitle">
        Experience premium grooming tailored to your style. Select from our signature services to begin your booking.
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

    <!-- Promotional Banner -->
    <section class="select-service-view__promo">
      <img 
        class="select-service-view__promo-img" 
        alt="A sophisticated barber shop interior with luxury leather chairs and warm amber lighting." 
        src="https://lh3.googleusercontent.com/aida/ADBb0uhhwngXljBDRlq8VZt86kTyttPU295Jse8AEYkl7ZUWjJtkmAouQvN_pmJE9wPn-Z8hJ5IV__Lm0YsfEbNSJSeADZJUDkjJvZRg3dNJmR7sJqLomVmJpNWavPTmEH_pHMAMiSUncmSk3my3fohHA7mfyMNbK61rMOOIIsQYgwlZfm-a9ErKJcVz8dtvSDdb7ZWaETvbKIoV4lplDx2CBj7Zd7F9y6vcxabWVoj9ezArF56Jmoygo3WIPq9GhY33QcixX4qbTyg7pw"
        aria-hidden="true"
      />
      <div class="select-service-view__promo-overlay">
        <h4 class="select-service-view__promo-title">Meridian Signature Pack</h4>
        <p class="select-service-view__promo-text">Combine any three services for a 20% savings on your total appointment.</p>
        <a class="select-service-view__promo-link" href="#">
          View Packages
          <span class="material-symbols-outlined select-service-view__promo-icon">arrow_forward</span>
        </a>
      </div>
    </section>
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
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .select-service-view__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .select-service-view__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ── Promo Banner ──────────────────────────────────────── */
.select-service-view__promo {
  margin-top: var(--space-16);
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  height: 16rem; /* h-64 */
  background-color: var(--color-primary-container);
}

.select-service-view__promo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: overlay;
  opacity: 0.6;
}

.select-service-view__promo-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-8);
  background: linear-gradient(to top, rgba(0, 50, 86, 0.9), transparent);
}

.select-service-view__promo-title {
  font-family: var(--font-family-headline);
  font-weight: 800;
  font-size: var(--font-size-2xl);
  color: #ffffff;
  letter-spacing: -0.025em; /* tracking-tight */
  margin-bottom: var(--space-1);
}

.select-service-view__promo-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-sm);
  max-width: 24rem; /* max-w-sm aprox */
  margin-bottom: var(--space-4);
}

.select-service-view__promo-link {
  color: #ffffff;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em; /* tracking-widest */
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  transition: gap var(--transition-base);
  width: fit-content;
}

.select-service-view__promo-link:hover,
.select-service-view__promo-link:focus-visible {
  gap: var(--space-4);
}

.select-service-view__promo-icon {
  font-size: var(--font-size-sm);
}
</style>
