<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentBookingStore } from '@/stores/useAppointmentBookingStore'

const router = useRouter()
const store = useAppointmentBookingStore()

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  fullDate: string;
  isPast: boolean;
}

// --- LÓGICA DINÁMICA DE FECHAS ---
const viewDate = ref(new Date()) // Fecha que controla qué mes estamos viendo
const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const currentMonthYear = computed(() => {
  return viewDate.value.toLocaleString('es-AR', { month: 'long', year: 'numeric' })
})



// --- NAVEGACIÓN ---
function changeMonth(offset: number) {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + offset, 1)
}

// --- SELECCIÓN Y TURNOS ---
const availableTimes = ref(['09:00 AM', '10:30 AM', '12:00 PM', '02:30 PM'])
const localSelectedDate = ref<string>('')
const localSelectedTime = ref<string>('')


// --- FORMATEO PARA LA UI ---
const formattedSelectedDate = computed(() => {
  if (!localSelectedDate.value) return 'Seleccioná una fecha'
  return new Date(localSelectedDate.value + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long', month: 'short', day: 'numeric'
  })
})

function handleContinue() {
  if (localSelectedDate.value && localSelectedTime.value) {
    store.setDateTime(localSelectedDate.value, localSelectedTime.value)
    router.push({ name: 'booking-details' })
  }
}

const serviceName = computed(() => store.selectedService?.name || 'Corte y Barba')
const serviceDuration = computed(() => store.selectedService?.duration || 45)
const servicePrice = computed(() => store.selectedService?.price || 2500)


const today = new Date()
today.setHours(0, 0, 0, 0) // Normalizamos a medianoche para comparar solo fechas

const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days: CalendarDay[] = []

  // Días del mes anterior
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    days.push({
      day: d,
      isCurrentMonth: false,
      fullDate: `${year}-${month}-${d}`,
      isPast: true // Los días de meses anteriores siempre se consideran pasados o inactivos
    })
  }

  // Días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, month, i)
    const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`

    days.push({
      day: i,
      isCurrentMonth: true,
      fullDate: formattedDate,
      // Si la fecha es menor a "hoy", es pasado
      isPast: dateObj < today
    })
  }

  return days
})


function selectDate(item: CalendarDay) {
  if (item.isCurrentMonth && !item.isPast) {
    localSelectedDate.value = item.fullDate
  }
}

function selectTime(time: string) {
  localSelectedTime.value = time
}
</script>

<template>
  <div class="select-date-view">
    <!-- Header Section -->
    <header class="select-date-view__header">
      <span class="select-date-view__step-indicator">Paso 2 de 4</span>
      <h2 class="select-date-view__title">
        Seleccioná tu <br />fecha preferida.
      </h2>
      <p class="select-date-view__subtitle">
        Elegí el día que mejor se adapte a tus horarios. Nuestros especialistas están listos para brindarte la experiencia Azure.
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
              <!-- Botón mes anterior -->
              <button
                class="calendar-card__nav-btn"
                @click="changeMonth(-1)"
                aria-label="Mes anterior"
              >
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <!-- Botón mes siguiente -->
              <button
                class="calendar-card__nav-btn"
                @click="changeMonth(1)"
                aria-label="Mes siguiente"
              >
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
              <!--
                Estado del día:
                - selected: si coincide con la fecha elegida
                - inactive: si es de otro mes
                - disabled: si es una fecha pasada
              -->
              <div
                class="calendar-card__day"
                :class="{
                  'calendar-card__day--selected': localSelectedDate === item.fullDate,
                  'calendar-card__day--inactive': !item.isCurrentMonth,
                  'calendar-card__day--disabled': item.isPast,
                  'calendar-card__day--available': item.isCurrentMonth && !item.isPast
                }"
                @click="selectDate(item)"
              >
                <span class="calendar-card__day-text">{{ item.day }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Slots -->
        <div class="slots-section">
          <h4 class="slots-section__title">
            Horarios disponibles para {{ formattedSelectedDate }}
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
            <h4 class="summary-card__label">Servicio Seleccionado</h4>
            <p class="summary-card__service-name">{{ serviceName }}</p>
            <div class="summary-card__duration">
              <span class="material-symbols-outlined summary-card__duration-icon">schedule</span>
              <span class="summary-card__duration-text">{{ serviceDuration }} min</span>
            </div>
          </div>

          <div class="summary-card__pricing">
            <div class="summary-card__pricing-row">
              <span class="summary-card__pricing-label">Costo del servicio</span>
              <span class="summary-card__pricing-amount">${{ servicePrice }}</span>
            </div>
            <div class="summary-card__pricing-footer">
              <span>Impuestos incluidos</span>
              <span>ARS</span>
            </div>
          </div>

          <!-- Botón continuar (puedes añadir :disabled si no hay selección) -->
          <button
            class="summary-card__continue-btn"
            :disabled="!localSelectedDate || !localSelectedTime"
            @click="handleContinue"
          >
            Continuar
          </button>
        </div>

        <!-- Informational Note -->
        <div class="info-note">
          <span class="material-symbols-outlined info-note__icon">info</span>
          <div class="info-note__content">
            <p class="info-note__title">Política de Cancelación</p>
            <p class="info-note__text">
              Cancelá con hasta 24 horas de anticipación para un reembolso completo. Las inasistencias pueden tener cargos adicionales.
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
  font-size: 2.25rem; /* 36px - 4xl */
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: var(--line-height-tight);
}

@media (min-width: 768px) {
  .select-date-view__title {
    font-size: 3rem; /* 48px - 5xl */
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
  gap: var(--space-6); /* Reduced from space-10 */
  max-width: 72rem;
}

@media (min-width: 1024px) {
  .select-date-view__grid {
    grid-template-columns: repeat(12, 1fr);
  }
}

.select-date-view__calendar-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-6); /* Reduced from space-8 */
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
  font-size: var(--font-size-xl); /* Reduced from 2xl */
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
  color: rgba(64, 72, 76, 0.6);
  font-family: var(--font-family-label);
  font-size: 0.625rem; /* 10px */
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding-bottom: var(--space-6);
}

.calendar-card__day-wrapper {
  padding: 0; /* Design uses internal padding for the day element */
}

.calendar-card__day {
  color: var(--color-secondary);
  font-family: var(--font-family-body);
  font-weight: 500;
  padding: var(--space-4) 0;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.calendar-card__day:hover:not(.calendar-card__day--inactive):not(.calendar-card__day--disabled):not(.calendar-card__day--selected) {
  background-color: var(--color-surface);
}

.calendar-card__day--inactive,
.calendar-card__day--disabled {
  color: rgba(72, 98, 110, 0.3);
  cursor: default;
  pointer-events: none;
}

.calendar-card__day--selected {
  color: floralwhite;
  font-weight: 700;
  background-color: var(--color-primary);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

.calendar-card__day--selected::before {
  content: '';
  position: absolute;
  inset: 0.5rem; /* inset-2 */
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 15px -3px rgba(0, 50, 86, 0.2);
  z-index: 0;
}

.calendar-card__day-text {
  position: relative;
  z-index: 1;
}

/* ── Slots Section ─────────────────────────────────────── */
.slots-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.slots-section__title {
  color: var(--color-primary);
  font-family: var(--font-family-label);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
  margin-bottom: var(--space-3);
}

.slots-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-2);
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
  font-size: var(--font-size-sm);
  cursor: pointer;
  text-align: center;
  transition: all var(--transition-base);
}

.slot-btn:hover:not(.slot-btn--selected) {
  background-color: var(--color-primary);
  color: #ffffff;
  cursor: pointer;
}

.slot-btn--selected {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 50, 86, 0.2);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

.slot-btn--selected:hover {
  background: var(--color-primary);
  color: #ffffff;
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
  font-weight: 800;
  font-size: var(--font-size-md); /* Reduced from lg */
  border: none;
  border-radius: var(--radius-full);
  padding: var(--space-4) 0; /* Reduced from space-5 */
  width: 100%;
  margin-top: var(--space-2); /* Reduced from space-4 */
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
