<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentBookingStore } from '@/stores/useAppointmentBookingStore'

const router = useRouter()
const bookingStore = useAppointmentBookingStore()

// ── Computed ─────────────────────────────────────────────
const service = computed(() => bookingStore.selectedService)
const guest   = computed(() => bookingStore.guestDetails)

const requiresDeposit = computed(() => !!service.value?.requiresDeposit)
const depositAmount   = computed(() => service.value?.depositAmount ?? 0)

const formattedDate = computed(() => {
  if (!bookingStore.selectedDate) return '—'
  const date = new Date(bookingStore.selectedDate + 'T00:00:00')
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  })
})

const formattedTime = computed(() => {
  if (!bookingStore.selectedTime) return '—'
  const [h = 0, m = 0] = bookingStore.selectedTime.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour   = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
})

// ── Handlers ─────────────────────────────────────────────
function handleBack() {
  router.back()
}

function handleConfirm() {
  // TODO: llamar al endpoint cuando esté disponible
  bookingStore.reset()
  router.push({ name: 'booking-success' })
}

function handlePayDeposit() {
  router.push({ name: 'booking-payment' })
}
</script>

<template>
  <div class="confirmation-view">
    <div class="confirmation-view__canvas">

      <!-- ── Hero ──────────────────────────────────────── -->
      <div class="confirmation-view__hero">
        <div class="confirmation-view__hero-icon" aria-hidden="true">
          <span
            class="material-symbols-outlined confirmation-view__hero-check"
            style="font-variation-settings: 'FILL' 1"
          >check_circle</span>
        </div>

        <h2 class="confirmation-view__hero-title">Confirmá tu turno</h2>

        <p class="confirmation-view__hero-subtitle">
          Revisá todos los detalles antes de confirmar.
          <template v-if="requiresDeposit">
            Este servicio requiere el pago de una seña para asegurar tu reserva.
          </template>
        </p>
      </div>

      <!-- ── Bento grid ─────────────────────────────────── -->
      <div class="confirmation-view__grid">

        <!-- Service card (2 cols) -->
        <div class="confirmation-view__card confirmation-view__card--service">
          <div class="confirmation-view__card-body">
            <span class="confirmation-view__label">Resumen del servicio</span>

            <div class="confirmation-view__service-header">
              <div>
                <h3 class="confirmation-view__service-name">
                  {{ service?.name ?? '—' }}
                </h3>
                <p class="confirmation-view__service-desc">
                  {{ service?.description ?? '' }}
                </p>
              </div>
              <span class="confirmation-view__service-price">
                ${{ service?.price?.toLocaleString('es-AR') ?? '—' }}
              </span>
            </div>
          </div>

          <div class="confirmation-view__service-meta">
            <div class="confirmation-view__meta-item">
              <span class="material-symbols-outlined confirmation-view__meta-icon" aria-hidden="true">schedule</span>
              <span class="confirmation-view__meta-text">{{ service?.duration ?? '—' }} min</span>
            </div>
            <div class="confirmation-view__meta-item">
              <span class="material-symbols-outlined confirmation-view__meta-icon" aria-hidden="true">location_on</span>
              <span class="confirmation-view__meta-text">{{ service?.location ?? '—' }}</span>
            </div>
          </div>
        </div>

        <!-- DateTime card (1 col) -->
        <div class="confirmation-view__card confirmation-view__card--datetime">
          <span class="confirmation-view__label">Fecha y hora</span>

          <div class="confirmation-view__datetime-icon-wrap">
            <span
              class="material-symbols-outlined confirmation-view__datetime-icon"
              aria-hidden="true"
            >calendar_today</span>
          </div>

          <h4 class="confirmation-view__datetime-date">{{ formattedDate }}</h4>

          <div class="confirmation-view__datetime-time-pill">
            {{ formattedTime }}
          </div>
        </div>

        <!-- Guest card (full width, visible si hay datos) -->
        <div
          v-if="guest"
          class="confirmation-view__card confirmation-view__card--guest"
        >
          <span class="confirmation-view__label">Datos del cliente</span>
          <div class="confirmation-view__guest-row">
            <div class="confirmation-view__guest-item">
              <span class="material-symbols-outlined confirmation-view__meta-icon" aria-hidden="true">person</span>
              <span class="confirmation-view__meta-text">{{ guest.firstName }} {{ guest.lastName }}</span>
            </div>
            <div class="confirmation-view__guest-item">
              <span class="material-symbols-outlined confirmation-view__meta-icon" aria-hidden="true">mail</span>
              <span class="confirmation-view__meta-text">{{ guest.email }}</span>
            </div>
            <div class="confirmation-view__guest-item">
              <span class="material-symbols-outlined confirmation-view__meta-icon" aria-hidden="true">phone</span>
              <span class="confirmation-view__meta-text">{{ guest.phone }}</span>
            </div>
          </div>
        </div>

        <!-- Deposit card (full width, solo si requiere seña) -->
        <div
          v-if="requiresDeposit"
          class="confirmation-view__card confirmation-view__card--deposit"
          role="region"
          aria-label="Información de seña"
        >
          <div class="confirmation-view__deposit-left">
            <div class="confirmation-view__deposit-icon-wrap" aria-hidden="true">
              <span class="material-symbols-outlined">payments</span>
            </div>
            <div>
              <span class="confirmation-view__label confirmation-view__label--inline">Seña requerida</span>
              <p class="confirmation-view__deposit-desc">
                Para asegurar tu turno debés abonar una seña. El saldo restante se abona el día del servicio.
              </p>
            </div>
          </div>
          <div class="confirmation-view__deposit-amount" aria-label="Monto de la seña">
            <span class="confirmation-view__deposit-eyebrow">Seña</span>
            <span class="confirmation-view__deposit-value">
              ${{ depositAmount.toLocaleString('es-AR') }}
            </span>
          </div>
        </div>

        <!-- Location banner (full width) -->
        <div class="confirmation-view__card confirmation-view__card--location">
          <div class="confirmation-view__location-overlay" aria-hidden="true"></div>
          <div class="confirmation-view__location-inner">
            <div class="confirmation-view__location-icon-wrap" aria-hidden="true">
              <span class="material-symbols-outlined">map</span>
            </div>
            <div>
              <p class="confirmation-view__location-eyebrow">Ubicación</p>
              <p class="confirmation-view__location-address">
                {{ service?.location ?? '—' }}
              </p>
            </div>
          </div>
        </div>

      </div><!-- /grid -->

      <!-- ── Action buttons ──────────────────────────────── -->
      <div class="confirmation-view__actions">

        <!-- CTA principal — bifurca según seña -->
        <button
          v-if="!requiresDeposit"
          id="btn-confirm"
          class="confirmation-view__btn confirmation-view__btn--primary"
          type="button"
          @click="handleConfirm"
        >
          <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
          Confirmar turno
        </button>

        <button
          v-else
          id="btn-pay-deposit"
          class="confirmation-view__btn confirmation-view__btn--primary"
          type="button"
          @click="handlePayDeposit"
        >
          <span class="material-symbols-outlined" aria-hidden="true">payments</span>
          Pagar seña · ${{ depositAmount.toLocaleString('es-AR') }}
        </button>

        <!-- Acción secundaria — volver -->
        <button
          id="btn-back"
          class="confirmation-view__btn confirmation-view__btn--secondary"
          type="button"
          @click="handleBack"
        >
          <span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Modificar datos
        </button>

      </div>

      <!-- ── Footer ──────────────────────────────────────── -->
      <footer class="confirmation-view__footer">
        <p class="confirmation-view__footer-help">
          ¿Dudas sobre tu reserva?
          <a href="mailto:soporte@sloty.app" class="confirmation-view__footer-link">
            Contactar Soporte
          </a>
        </p>
        <p class="confirmation-view__footer-ref" aria-label="Referencia de reserva">
          ID Ref: SLOTY-{{ Date.now().toString(36).toUpperCase() }}
        </p>
      </footer>

    </div><!-- /canvas -->
  </div>
</template>

<style scoped>
/* ── Shell ────────────────────────────────────────────────── */
.confirmation-view {
  min-height: calc(100vh - 5rem);
  background-color: var(--color-background);
  display: flex;
  justify-content: center;
}

.confirmation-view__canvas {
  width: 100%;
  max-width: 56rem;
  padding: var(--space-16) var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

/* ── Hero ─────────────────────────────────────────────────── */
.confirmation-view__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
}

.confirmation-view__hero-icon {
  width: 6rem;
  height: 6rem;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xl), var(--shadow-primary-xl);
  animation: icon-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  margin-bottom: var(--space-4);
}

@keyframes icon-pop {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}

.confirmation-view__hero-check {
  font-size: 3rem;
  color: #ffffff;
}

.confirmation-view__hero-title {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-display);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-primary);
  margin: 0;
  animation: slide-up 0.4s ease 0.15s both;
}

.confirmation-view__hero-subtitle {
  font-family: var(--font-family-body);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 32rem;
  line-height: var(--line-height-normal);
  margin: 0;
  animation: slide-up 0.4s ease 0.25s both;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Bento grid ───────────────────────────────────────────── */
.confirmation-view__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  animation: slide-up 0.4s ease 0.35s both;
}

@media (min-width: 640px) {
  .confirmation-view__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ── Shared card ──────────────────────────────────────────── */
.confirmation-view__card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.confirmation-view__label {
  display: block;
  font-family: var(--font-family-label);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.confirmation-view__label--inline {
  margin-bottom: var(--space-2);
}

/* ── Service card (2 cols) ────────────────────────────────── */
.confirmation-view__card--service {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-8);
}

@media (min-width: 640px) {
  .confirmation-view__card--service {
    grid-column: span 2;
  }
}

.confirmation-view__card-body { flex: 1; }

.confirmation-view__service-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.confirmation-view__service-name {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-primary);
  margin: 0 0 var(--space-2);
  line-height: var(--line-height-tight);
}

.confirmation-view__service-desc {
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.confirmation-view__service-price {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-primary);
  white-space: nowrap;
  flex-shrink: 0;
}

.confirmation-view__service-meta {
  display: flex;
  gap: var(--space-8);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-surface-container);
}

.confirmation-view__meta-item,
.confirmation-view__guest-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.confirmation-view__meta-icon {
  color: var(--color-primary-container);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.confirmation-view__meta-text {
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

/* ── DateTime card (1 col) ────────────────────────────────── */
.confirmation-view__card--datetime {
  background-color: var(--color-surface-container-low);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-4);
}

.confirmation-view__datetime-icon-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.confirmation-view__datetime-icon {
  font-size: 2.5rem;
  color: var(--color-primary);
}

.confirmation-view__datetime-date {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--color-primary);
  margin: 0;
  text-transform: capitalize;
}

.confirmation-view__datetime-time-pill {
  display: inline-block;
  padding: var(--space-2) var(--space-6);
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  font-family: var(--font-family-headline);
  font-size: var(--font-size-base);
  font-weight: 800;
  color: var(--color-primary);
}

/* ── Guest card (full width) ──────────────────────────────── */
.confirmation-view__card--guest {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
}

@media (min-width: 640px) {
  .confirmation-view__card--guest {
    grid-column: span 3;
  }
}

.confirmation-view__guest-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6) var(--space-12);
}

/* ── Deposit card (full width) ────────────────────────────── */
.confirmation-view__card--deposit {
  background-color: var(--color-primary-fixed);
  padding: var(--space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

@media (min-width: 640px) {
  .confirmation-view__card--deposit {
    grid-column: span 3;
  }
}

.confirmation-view__deposit-left {
  display: flex;
  align-items: flex-start;
  gap: var(--space-6);
  flex: 1;
}

.confirmation-view__deposit-icon-wrap {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ffffff;
}

.confirmation-view__deposit-desc {
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.confirmation-view__deposit-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.confirmation-view__deposit-eyebrow {
  font-family: var(--font-family-label);
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
}

.confirmation-view__deposit-value {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
}

/* ── Location banner (full width) ─────────────────────────── */
.confirmation-view__card--location {
  position: relative;
  height: 12rem;
  background-color: var(--color-surface-container-high);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .confirmation-view__card--location {
    grid-column: span 3;
  }
}

.confirmation-view__location-overlay {
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  opacity: 0.08;
}

.confirmation-view__location-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-6);
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: var(--space-6);
  border-radius: 0.75rem;
  max-width: 28rem;
  width: 90%;
  box-shadow: var(--shadow-md);
}

.confirmation-view__location-icon-wrap {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #ffffff;
}

.confirmation-view__location-eyebrow {
  font-family: var(--font-family-label);
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
}

.confirmation-view__location-address {
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0;
}

/* ── Actions ──────────────────────────────────────────────── */
.confirmation-view__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  animation: slide-up 0.4s ease 0.45s both;
}

@media (min-width: 480px) {
  .confirmation-view__actions {
    flex-direction: row;
  }
}

.confirmation-view__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-10);
  border-radius: var(--radius-full);
  font-family: var(--font-family-headline);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    background-color var(--transition-fast),
    color var(--transition-fast);
  width: 100%;
}

@media (min-width: 480px) {
  .confirmation-view__btn {
    width: auto;
  }
}

.confirmation-view__btn--primary {
  background: var(--gradient-primary);
  color: #ffffff;
  box-shadow: var(--shadow-xl), var(--shadow-primary-xl);
}

.confirmation-view__btn--primary:hover {
  transform: scale(1.04);
  box-shadow: 0 24px 32px -8px rgba(0, 50, 86, 0.3);
}

.confirmation-view__btn--primary:active {
  transform: scale(0.96);
}

.confirmation-view__btn--primary:focus-visible {
  outline: 3px solid var(--color-primary-fixed-dim);
  outline-offset: 3px;
}

.confirmation-view__btn--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.confirmation-view__btn--secondary:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

.confirmation-view__btn--secondary:active {
  transform: scale(0.96);
}

.confirmation-view__btn--secondary:focus-visible {
  outline: 3px solid var(--color-primary-fixed-dim);
  outline-offset: 3px;
}

/* ── Footer ───────────────────────────────────────────────── */
.confirmation-view__footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding-top: var(--space-8);
  animation: slide-up 0.4s ease 0.55s both;
}

.confirmation-view__footer-help {
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.confirmation-view__footer-link {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-decoration: none;
}

.confirmation-view__footer-link:hover {
  text-decoration: underline;
}

.confirmation-view__footer-ref {
  font-family: var(--font-family-label);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-text-secondary);
  opacity: 0.5;
  margin: 0;
}
</style>
