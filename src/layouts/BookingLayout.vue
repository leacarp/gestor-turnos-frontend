<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

interface BookingStep {
  id: number
  label: string
  icon: string
  routeNames: string[]
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.restoreSession()
})

const steps: BookingStep[] = [
  { id: 1, label: 'Selección de Servicio', icon: 'content_cut', routeNames: ['booking-service'] },
  { id: 2, label: 'Elegir Fecha',          icon: 'calendar_today', routeNames: ['booking-schedule'] },
  { id: 3, label: 'Datos de cliente',      icon: 'person',         routeNames: ['booking-details', 'booking-guest-details'] },
  { id: 4, label: 'Confirmación',          icon: 'check_circle',   routeNames: ['booking-confirmation'] },
]

const currentStepIndex = computed(() => {
  const idx = steps.findIndex(s => s.routeNames.includes(route.name as string))
  return idx >= 0 ? idx : 0
})
</script>

<template>
  <div class="booking-layout">
    <!-- Sidebar -->
    <aside class="booking-layout__sidebar">
      <div class="booking-layout__sidebar-inner">
        <!-- Brand -->
        <div class="booking-layout__brand">
          <span class="booking-layout__logo">Sloty</span>
          <span class="booking-layout__subtitle">Proceso de Reserva</span>
        </div>

        <!-- Progress steps -->
        <nav class="booking-layout__nav" aria-label="Booking progress">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="booking-layout__step"
            :class="{
              'booking-layout__step--completed': index < currentStepIndex,
              'booking-layout__step--active':    index === currentStepIndex,
              'booking-layout__step--pending':   index > currentStepIndex,
            }"
            @click="index < currentStepIndex ? router.push({ name: step.routeNames[0] }) : null"
          >
            <span
              class="material-symbols-outlined booking-layout__step-icon"
              :class="{ 'booking-layout__step-icon--filled': index <= currentStepIndex }"
              aria-hidden="true"
            >{{ step.icon }}</span>
            <span class="booking-layout__step-label">{{ step.label }}</span>
            <span 
              v-if="index < currentStepIndex" 
              class="material-symbols-outlined booking-layout__step-check"
            >
              check_circle
            </span>
          </div>

          <div class="booking-layout__progress">
            <div class="booking-layout__progress-card">
              <div class="booking-layout__progress-header">
                <div class="booking-layout__progress-dot"></div>
                <span class="booking-layout__progress-text">Paso {{ currentStepIndex + 1 }} de {{ steps.length }}</span>
              </div>
              <div class="booking-layout__progress-bar">
                <div 
                  class="booking-layout__progress-fill" 
                  :style="{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </nav>

        <div class="booking-layout__decor">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPCGzvlrJqhMdvrcte_Dy_-kyauOc9InLhWqtF4ru8ocSXwIsBKf3QTcS9e2qkIs22XUQnpav1CpiJQHL2Kib2XogT6m26PrtHlFT2Uoc2TdPESchr7m9hPLk5lCaQRUXifZULL9QHgn2zkPoThRWYfbnRJltvRtvVdnLSAdx3FQ7J1Ykmi0fEhYwx2LYg_MQqPEGaJfz1L9FLbWoU7CJxee8QnWwU5zNSTpuV-V7OlhEackKEspMuS3rVl-amb_oMeVNLaMgW-srz" 
            class="booking-layout__decor-img"
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
          <div class="booking-layout__decor-overlay"></div>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div class="booking-layout__main">
      <!-- Sticky header -->
      <header class="booking-layout__header">
        <span class="booking-layout__header-title">Finalización de Reserva</span>
        
      </header>

      <!-- Page content -->
      <main class="booking-layout__content">
        <router-view v-slot="{ Component }">
          <transition name="booking-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Layout shell ──────────────────────────────────────────
 * Mobile-first. Hasta 1024px el "sidebar" no es una columna sino una
 * banda superior compacta: marca, paso actual y barra de progreso. El
 * listado completo de pasos y la imagen decorativa solo tienen sentido
 * cuando hay una columna de 20rem para mostrarlos.
 * ───────────────────────────────────────────────────────── */
.booking-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
}

/* ── Sidebar ───────────────────────────────────────────── */
.booking-layout__sidebar {
  width: 100%;
  flex-shrink: 0;
  background-color: var(--color-primary);
  color: #ffffff;
  box-shadow: var(--shadow-lg);
  z-index: 50;
  overflow: hidden;
}

.booking-layout__sidebar-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4) var(--page-padding-x);
  position: relative;
  z-index: 10;
}

/* Brand */
.booking-layout__brand {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: 0;
}

.booking-layout__logo {
  font-size: var(--font-size-xl);
  font-family: var(--font-family-headline);
  font-weight: 800;
  letter-spacing: -0.025em;
  display: block;
}

.booking-layout__subtitle {
  color: var(--color-primary-container);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  opacity: 0.8;
  display: block;
  margin-top: 0;
}

/* Steps nav */
.booking-layout__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* En la banda superior solo se muestra el paso en curso: los cuatro
 * apilados ocuparían media pantalla y el usuario ya sabe dónde está por
 * la barra de progreso. */
.booking-layout__step {
  display: none;
  align-items: center;
  gap: var(--space-3);
  color: rgba(255, 255, 255, 0.6);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast), transform var(--transition-fast);
  cursor: default;
}

.booking-layout__step--active {
  display: flex;
}

.booking-layout__step--completed {
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.booking-layout__step--completed:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.booking-layout__step--active {
  color: #ffffff;
  font-weight: var(--font-weight-bold);
}

.booking-layout__step--pending {
  color: rgba(255, 255, 255, 0.3);
}

.booking-layout__step-icon {
  color: var(--color-primary-fixed-dim);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.booking-layout__step-icon--filled {
  font-variation-settings: 'FILL' 1;
}

.booking-layout__step-label {
  font-family: var(--font-family-headline);
}

.booking-layout__step-check {
  margin-left: auto;
  font-size: var(--font-size-sm);
  color: var(--color-primary-fixed-dim);
}

/* Progress card */
.booking-layout__progress-card {
  padding: 0;
  border-radius: var(--radius-2xl);
  background-color: transparent;
}

.booking-layout__progress-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.booking-layout__progress-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-fixed-dim);
}

.booking-layout__progress-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.booking-layout__progress-bar {
  width: 100%;
  height: 0.375rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.booking-layout__progress-fill {
  height: 100%;
  background-color: var(--color-primary-fixed-dim);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

/* Decor — puramente ornamental, no entra en la banda de celular */
.booking-layout__decor {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16rem;
  z-index: 1;
  pointer-events: none;
}

.booking-layout__decor-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
  mix-blend-mode: overlay;
}

.booking-layout__decor-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-primary), transparent);
}

/* ── Main area ─────────────────────────────────────────── */
.booking-layout__main {
  flex: 1;
  /* min-width: 0 evita que una card ancha estire el flex item y genere
   * scroll horizontal en toda la página. */
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Header */
.booking-layout__header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
  padding: 0 var(--page-padding-x);
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-sm);
}

.booking-layout__header-title {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-sm);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-primary);
  /* El título completo no entra en 375px; que corte en vez de desbordar. */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.booking-layout__header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.booking-layout__header-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.booking-layout__header-icon-btn:hover {
  color: var(--color-primary-container);
}

.booking-layout__header-icon-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.booking-layout__header-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-container-low);
}

/* Content */
.booking-layout__content {
  flex: 1;
}

/* ── lg: escritorio (>= 1024px) ─────────────────────────────
 * Recién acá hay ancho para la columna lateral: la banda superior vuelve
 * a ser el sidebar fijo de 20rem con los cuatro pasos y el decorado.
 * ───────────────────────────────────────────────────────── */
@media (min-width: 1024px) {
  .booking-layout {
    flex-direction: row;
  }

  .booking-layout__sidebar {
    width: var(--sidebar-width-booking);
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
  }

  .booking-layout__sidebar-inner {
    height: 100%;
    gap: 0;
    padding: var(--space-12) var(--space-6);
  }

  .booking-layout__brand {
    display: block;
    margin-bottom: var(--space-12);
  }

  .booking-layout__logo {
    font-size: var(--font-size-3xl);
  }

  .booking-layout__subtitle {
    font-size: var(--font-size-sm);
    margin-top: var(--space-1);
  }

  .booking-layout__nav {
    flex: 1;
    gap: var(--space-4);
  }

  .booking-layout__step {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-lg);
  }

  .booking-layout__step--active {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .booking-layout__progress {
    margin-top: auto;
  }

  .booking-layout__progress-card {
    padding: var(--space-5);
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(4px);
  }

  .booking-layout__progress-header {
    margin-bottom: var(--space-4);
  }

  .booking-layout__decor {
    display: block;
  }

  .booking-layout__main {
    margin-left: var(--sidebar-width-booking);
    min-height: 100vh;
  }

  .booking-layout__header {
    height: 5rem;
  }

  .booking-layout__header-title {
    font-size: var(--font-size-xl);
  }
}

/* ── Transition ────────────────────────────────────────── */
.booking-fade-enter-active,
.booking-fade-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.booking-fade-enter-from,
.booking-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
