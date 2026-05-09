<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentBookingStore } from '@/stores/useAppointmentBookingStore'

const router = useRouter()
const store = useAppointmentBookingStore()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

function handleSubmit() {
  store.setGuestDetails({
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    email: form.value.email,
    phone: form.value.phone,
  })
  router.push({ name: 'booking-confirmation' })
}
</script>

<template>
  <div class="guest-details-view">
    <div class="guest-details-view__container">
      
      <!-- Title Section -->
      <div class="guest-details-view__header">
        <h2 class="guest-details-view__title">Datos del Invitado</h2>
        <p class="guest-details-view__subtitle">Por favor, ingresá tu información de contacto para asegurar tu reserva.</p>
      </div>

      <!-- Form Section -->
      <form class="guest-form" @submit.prevent="handleSubmit">
        <!-- Name -->
        <div class="guest-form__field">
          <label class="guest-form__label">Nombre</label>
          <input 
            v-model="form.firstName"
            class="guest-form__input" 
            placeholder="ej. Julián" 
            type="text" 
            required 
          />
        </div>

        <!-- Last Name -->
        <div class="guest-form__field">
          <label class="guest-form__label">Apellido</label>
          <input 
            v-model="form.lastName"
            class="guest-form__input" 
            placeholder="ej. Pérez" 
            type="text" 
            required 
          />
        </div>

        <!-- Email -->
        <div class="guest-form__field guest-form__field--full">
          <label class="guest-form__label">Correo Electrónico</label>
          <input 
            v-model="form.email"
            class="guest-form__input" 
            placeholder="julian@meridian.com" 
            type="email" 
            required 
          />
        </div>

        <!-- Phone -->
        <div class="guest-form__field guest-form__field--full">
          <label class="guest-form__label">Número de Teléfono</label>
          <input 
            v-model="form.phone"
            class="guest-form__input" 
            placeholder="+54 11 1234-5678" 
            type="tel" 
            required 
          />
        </div>

        <div class="guest-form__footer">
          <p class="guest-form__disclaimer">
            Al continuar, aceptás nuestros términos de servicio. Se enviará un correo de confirmación una vez finalizada la reserva.
          </p>
          <div class="guest-form__actions">
            <button class="guest-form__submit-btn" type="submit">
              Continuar
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.guest-details-view {
  background-color: var(--color-background);
  min-height: 100vh;
}

.guest-details-view__container {
  max-width: 48rem; /* max-w-3xl */
  margin: 0 auto;
  padding: var(--space-12) var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

@media (min-width: 768px) {
  .guest-details-view__container {
    padding-top: var(--space-16);
    padding-bottom: var(--space-16);
  }
}

/* ── Header ──────────────────────────────────────────────── */
.guest-details-view__header {
  text-align: center;
}

.guest-details-view__title {
  color: var(--color-primary);
  font-family: var(--font-family-headline);
  font-weight: var(--font-weight-extrabold);
  font-size: var(--font-size-4xl); /* text-[2.5rem] */
  letter-spacing: -0.05em; /* tracking-tighter */
  line-height: var(--line-height-tight);
  margin: 0 0 var(--space-3) 0;
}

.guest-details-view__subtitle {
  color: var(--color-text-secondary); /* on-surface-variant */
  font-family: var(--font-family-body);
  font-size: var(--font-size-lg);
  margin: 0;
}

/* ── Form Section ────────────────────────────────────────── */
.guest-form {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: var(--space-6);
  column-gap: var(--space-8);
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-10);
  border-radius: var(--radius-3xl);
  border: 1px solid rgba(192, 200, 204, 0.3); /* border-outline-variant/30 */
  box-shadow: var(--shadow-sm);
}

@media (min-width: 768px) {
  .guest-form {
    grid-template-columns: repeat(2, 1fr);
  }
}

.guest-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.guest-form__field--full {
  grid-column: 1 / -1;
}

.guest-form__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-primary);
  font-family: var(--font-family-label);
}

.guest-form__input {
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-6);
  font-family: var(--font-family-body);
  color: var(--color-text-primary);
  transition: box-shadow var(--transition-fast);
  outline: none;
}

.guest-form__input::placeholder {
  color: var(--color-outline-variant);
}

.guest-form__input:focus {
  box-shadow: 0 0 0 2px rgba(0, 50, 86, 0.2); /* focus:ring-2 focus:ring-primary/20 */
}

/* ── Footer ──────────────────────────────────────────────── */
.guest-form__footer {
  grid-column: 1 / -1;
  padding-top: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.guest-form__disclaimer {
  font-size: 0.8125rem; /* text-[0.8125rem] */
  color: var(--color-text-secondary); /* on-surface-variant */
  line-height: var(--line-height-loose); /* leading-relaxed */
  text-align: center;
  margin: 0 0 var(--space-8) 0;
  font-style: italic;
}

.guest-form__actions {
  display: flex;
  justify-content: center;
  width: 100%;
}

.guest-form__submit-btn {
  width: 100%;
  padding: var(--space-5) var(--space-10);
  background: var(--gradient-primary);
  color: #ffffff;
  font-family: var(--font-family-headline);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  border: none;
  box-shadow: var(--shadow-primary-xl); /* shadow-xl shadow-primary/10 (using var for similarity) */
  text-transform: uppercase;
  letter-spacing: 0.1em; /* tracking-widest */
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

@media (min-width: 768px) {
  .guest-form__submit-btn {
    width: 16rem; /* md:w-64 */
  }
}

.guest-form__submit-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 50, 86, 0.25); /* hover:shadow-2xl (approximate) */
}

.guest-form__submit-btn:active {
  transform: scale(0.95);
}
</style>
