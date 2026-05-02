<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentBookingStore } from '@/stores/useAppointmentBookingStore'

const router = useRouter()
const store = useAppointmentBookingStore()

// Mock data
const currentMonthYear = ref('October 2023')
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Generamos días para el calendario (simil al mockup)
const calendarDays = computed(() => {
  const days = []
  // Días del mes anterior
  for (let i = 27; i <= 30; i++) {
    days.push({ day: i, isCurrentMonth: false, fullDate: `2023-09-${i}` })
  }
  // Días del mes actual
  for (let i = 1; i <= 31; i++) {
    const formattedDay = i.toString().padStart(2, '0')
    days.push({ day: i, isCurrentMonth: true, fullDate: `2023-10-${formattedDay}` })
  }
  return days
})

const availableTimes = ['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM']

// Local state for UI selection before confirming
const localSelectedDate = ref<string>('2023-10-12') // Default pre-selected as in mockup
const localSelectedTime = ref<string>('10:30 AM') // Default pre-selected

function selectDate(date: string, isCurrentMonth: boolean) {
  if (isCurrentMonth) {
    localSelectedDate.value = date
    // In a real app, we'd fetch available times for this date here
  }
}

function selectTime(time: string) {
  localSelectedTime.value = time
}

function handleContinue() {
  if (localSelectedDate.value && localSelectedTime.value) {
    store.setDateTime(localSelectedDate.value, localSelectedTime.value)
    router.push({ name: 'booking-details' }) // Suponiendo que la ruta que sigue es booking-details
  }
}

// Para el resumen, obtenemos el servicio del store (si existe) o mostramos un fallback
const serviceName = computed(() => store.selectedService?.name || 'Corte y Barba')
const serviceDuration = computed(() => store.selectedService?.duration || 45)
const servicePrice = computed(() => store.selectedService?.price || 2500)
</script>

<template>
  <div class="select-date-view">
    <!-- Header Section -->
    <header class="select-date-view__header">
      <span class="select-date-view__step-indicator">Step 2 of 4</span>
      <h2 class="select-date-view__title">
        Select your <br />preferred date.
      </h2>
      <p class="select-date-view__subtitle">
        Choose a day that suits your schedule. Our specialists are ready to provide the Azure experience.
      </p>
    </header>

    <!-- Bento Grid Layout -->
    <div class="select-date-view__grid">
      
      <!-- Main Calendar Section -->
      <section class="select-date-view__calendar-section">
        
        <!-- Month Picker -->
        <div class="calendar-card">
          <div class="calendar-card__header">
            <h3 class="calendar-card__title">{{ currentMonthYear }}</h3>
            <div class="calendar-card__actions">
              <button class="calendar-card__nav-btn" aria-label="Previous month">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button class="calendar-card__nav-btn" aria-label="Next month">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="calendar-card__grid">
            <!-- Days of week -->
            <div 
              v-for="day in weekDays" 
              :key="day" 
              class="calendar-card__weekday"
            >
              {{ day }}
            </div>
            
            <!-- Days -->
            <div 
              v-for="item in calendarDays" 
              :key="item.fullDate"
              class="calendar-card__day-wrapper"
            >
              <!-- Selected State -->
              <div 
                v-if="item.isCurrentMonth && localSelectedDate === item.fullDate"
                class="calendar-card__day calendar-card__day--selected"
              >
                <div class="calendar-card__day-bg"></div>
                <span class="calendar-card__day-text">{{ item.day }}</span>
              </div>
              
              <!-- Normal State -->
              <div 
                v-else
                class="calendar-card__day"
                :class="{ 'calendar-card__day--inactive': !item.isCurrentMonth }"
                @click="selectDate(item.fullDate, item.isCurrentMonth)"
              >
                {{ item.day }}
              </div>
            </div>
          </div>
        </div>

        <!-- Available Slots -->
        <div class="slots-section">
          <h4 class="slots-section__title">
            Available Times for Thursday, Oct 12
          </h4>
          <div class="slots-section__grid">
            <button 
              v-for="time in availableTimes" 
              :key="time"
              class="slot-btn"
              :class="{ 'slot-btn--selected': localSelectedTime === time }"
              @click="selectTime(time)"
            >
              {{ time }}
            </button>
          </div>
        </div>

      </section>

      <!-- Booking Summary Sidecard -->
      <aside class="select-date-view__summary">
        
        <div class="summary-card">
          <div class="summary-card__content">
            <h4 class="summary-card__label">Selected Service</h4>
            <p class="summary-card__service-name">{{ serviceName }}</p>
            <div class="summary-card__duration">
              <span class="material-symbols-outlined summary-card__duration-icon">schedule</span>
              <span class="summary-card__duration-text">{{ serviceDuration }} min</span>
            </div>
          </div>
          
          <div class="summary-card__pricing">
            <div class="summary-card__pricing-row">
              <span class="summary-card__pricing-label">Service cost</span>
              <span class="summary-card__pricing-amount">${{ servicePrice }}</span>
            </div>
            <div class="summary-card__pricing-footer">
              <span>Taxes included</span>
              <span>ARS</span>
            </div>
          </div>
          
          <button class="summary-card__continue-btn" @click="handleContinue">
            Continue
          </button>
        </div>

        <!-- Informational Note -->
        <div class="info-note">
          <span class="material-symbols-outlined info-note__icon">info</span>
          <div class="info-note__content">
            <p class="info-note__title">Cancellation Policy</p>
            <p class="info-note__text">
              Cancel up to 24 hours in advance for a full refund. No-shows may be charged a fee.
            </p>
          </div>
        </div>

      </aside>
    </div>
  </div>
</template>

<style scoped>
/* ── Layout ────────────────────────────────────────────── */
.select-date-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: var(--space-12) var(--space-6);
  padding-bottom: 6rem; /* Separar más del borde inferior */
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 768px) {
  .select-date-view {
    padding: var(--space-16) var(--space-16);
    padding-bottom: 8rem; /* Separar aún más del fondo en pantallas grandes */
  }
}

@media (min-width: 1280px) {
  .select-date-view {
    padding-left: 10rem; /* Empujar el contenido fuertemente a la derecha */
    padding-right: 10rem;
  }
}

/* ── Header ────────────────────────────────────────────── */
.select-date-view__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 56rem; /* max-w-4xl */
}

.select-date-view__step-indicator {
  color: var(--color-primary);
  font-family: var(--font-family-label);
  font-size: 0.75rem; /* 12px */
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.select-date-view__title {
  color: var(--color-primary);
  font-family: var(--font-family-headline);
  font-size: 2.25rem; /* 36px */
  font-weight: 800; /* extrabold */
  letter-spacing: -0.025em;
  line-height: var(--line-height-tight);
}

@media (min-width: 768px) {
  .select-date-view__title {
    font-size: 3rem; /* 48px */
  }
}

.select-date-view__subtitle {
  color: var(--color-secondary);
  font-family: var(--font-family-body);
  font-size: var(--font-size-lg);
  max-width: 36rem; /* max-w-xl */
}

/* ── Grid ──────────────────────────────────────────────── */
.select-date-view__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-10);
  max-width: 72rem; /* max-w-6xl */
}

@media (min-width: 1024px) {
  .select-date-view__grid {
    grid-template-columns: repeat(12, 1fr);
  }
}

.select-date-view__calendar-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

@media (min-width: 1024px) {
  .select-date-view__calendar-section {
    grid-column: span 8 / span 8;
  }
}

.select-date-view__summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (min-width: 1024px) {
  .select-date-view__summary {
    grid-column: span 4 / span 4;
  }
}

/* ── Calendar Card ─────────────────────────────────────── */
.calendar-card {
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-3xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.calendar-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-10);
}

.calendar-card__title {
  color: var(--color-primary);
  font-family: var(--font-family-headline);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.calendar-card__actions {
  display: flex;
  gap: var(--space-2);
}

.calendar-card__nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3);
  border-radius: var(--radius-full);
  border: none;
  background-color: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.calendar-card__nav-btn:hover {
  background-color: var(--color-surface-container-high);
}

.calendar-card__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: var(--space-4);
  text-align: center;
}

.calendar-card__weekday {
  color: rgba(64, 72, 76, 0.6); /* text-secondary/60 approx */
  font-family: var(--font-family-label);
  font-size: 0.625rem; /* 10px */
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding-bottom: var(--space-6);
}

.calendar-card__day-wrapper {
  padding: var(--space-4) 0;
}

.calendar-card__day {
  color: var(--color-secondary);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-medium);
  padding: var(--space-4) 0;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.calendar-card__day:hover:not(.calendar-card__day--inactive) {
  background-color: var(--color-surface);
}

.calendar-card__day--inactive {
  color: rgba(72, 98, 110, 0.3); /* text-secondary/30 */
  cursor: default;
}

.calendar-card__day--selected {
  position: relative;
  cursor: pointer;
}

.calendar-card__day-bg {
  position: absolute;
  inset: 0.5rem; /* inset-2 equivalent approx */
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 15px -3px rgba(0, 50, 86, 0.2);
}

.calendar-card__day-text {
  position: relative;
  color: #ffffff;
  font-weight: var(--font-weight-bold);
}

/* ── Slots Section ─────────────────────────────────────── */
.slots-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.slots-section__title {
  color: var(--color-primary);
  font-family: var(--font-family-label);
  font-size: 0.875rem; /* 14px */
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
}

.slots-section__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .slots-section__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.slot-btn {
  background-color: var(--color-surface-container-low);
  color: var(--color-primary);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-bold);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-6);
  cursor: pointer;
  text-align: center;
  transition: background-color var(--transition-base), color var(--transition-base), transform var(--transition-fast), box-shadow var(--transition-fast);
}

.slot-btn:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

.slot-btn--selected {
  background: var(--gradient-primary);
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 50, 86, 0.2);
}

.slot-btn--selected:hover {
  background: var(--gradient-primary);
}

/* ── Summary Card ──────────────────────────────────────── */
.summary-card {
  background-color: var(--color-primary);
  color: #ffffff;
  border-radius: var(--radius-3xl);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
}

.summary-card__content {
  display: flex;
  flex-direction: column;
}

.summary-card__label {
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-family-label);
  font-size: 0.75rem; /* 12px */
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0 0 var(--space-2) 0;
}

.summary-card__service-name {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.summary-card__duration {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  color: rgba(255, 255, 255, 0.7);
}

.summary-card__duration-icon {
  font-size: 1.125rem; /* 18px */
}

.summary-card__duration-text {
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.summary-card__pricing {
  background-color: rgba(255, 255, 255, 0.05);
  padding: var(--space-6);
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.summary-card__pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-card__pricing-label {
  color: rgba(255, 255, 255, 0.6);
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
}

.summary-card__pricing-amount {
  font-family: var(--font-family-body);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.summary-card__pricing-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
}

.summary-card__continue-btn {
  background-color: #ffffff;
  color: var(--color-primary);
  font-family: var(--font-family-body);
  font-weight: 800; /* extrabold */
  font-size: var(--font-size-lg);
  border: none;
  border-radius: var(--radius-full);
  padding: var(--space-5) 0;
  width: 100%;
  margin-top: var(--space-4);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: 0 20px 25px -5px rgba(0, 73, 122, 0.4), 0 8px 10px -6px rgba(0, 73, 122, 0.4);
}

.summary-card__continue-btn:hover {
  transform: scale(1.02);
}

/* ── Info Note ─────────────────────────────────────────── */
.info-note {
  background-color: rgba(231, 232, 233, 0.4); /* bg-surface-container-high/40 */
  border-radius: var(--radius-3xl);
  padding: var(--space-8);
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.info-note__icon {
  color: var(--color-primary);
}

.info-note__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.info-note__title {
  color: var(--color-primary);
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.info-note__text {
  color: var(--color-secondary);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-loose);
  margin: 0;
}
</style>
