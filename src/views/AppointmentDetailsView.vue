<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentBookingStore } from '@/stores/useAppointmentBookingStore'
import { userService, type UserProfile } from '@/services/userService'

const router = useRouter()
const store = useAppointmentBookingStore()

const isLoading = ref(true)
const userProfile = ref<UserProfile | null>(null)
const notes = ref('')

onMounted(async () => {
  try {
    const { data } = await userService.getCurrentUserProfile()
    userProfile.value = data
    
    // Si ya teníamos notas guardadas en el store, las recuperamos
    if (store.guestDetails?.notes) {
      notes.value = store.guestDetails.notes
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
  } finally {
    isLoading.value = false
  }
})

const fullName = computed(() => {
  if (!userProfile.value) return ''
  return `${userProfile.value.firstName} ${userProfile.value.lastName}`
})

function handleEditProfile() {
  // Placeholder para la vista de edición de perfil
  router.push({ name: 'profile-edit' })
}

function handleConfirm() {
  if (userProfile.value) {
    store.setGuestDetails({
      firstName: userProfile.value.firstName,
      lastName: userProfile.value.lastName,
      email: userProfile.value.email,
      phone: userProfile.value.phone,
      notes: notes.value
    })
    router.push({ name: 'booking-confirmation' })
  }
}
</script>

<template>
  <div class="details-view">
    <div class="details-view__container">
      
      <!-- Editorial Header Section -->
      <header class="details-view__header">
        <p class="details-view__step">Paso 03 de 04</p>
        <h1 class="details-view__title">Verificá tus datos.</h1>
        <p class="details-view__subtitle">
          Recuperamos la información de tu cuenta para agilizar el proceso de reserva. Por favor, asegurate de que todo sea correcto antes de proceder a la confirmación final.
        </p>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="details-view__loading">
        <span class="material-symbols-outlined details-view__spinner">sync</span>
        <p>Cargando tu perfil...</p>
      </div>

      <div v-else class="details-view__content">
        <!-- Guest Information Bento Section -->
        <section class="profile-card">
          <div class="profile-card__header">
            <div>
              <h3 class="profile-card__title">Perfil Activo</h3>
              <p class="profile-card__subtitle">Información vinculada automáticamente desde tu cuenta de TurnoPro</p>
            </div>
            <button type="button" class="profile-card__edit-btn" @click="handleEditProfile">
              <span class="material-symbols-outlined profile-card__edit-icon">edit</span>
              Editar Perfil
            </button>
          </div>

          <div class="profile-card__grid">
            <div class="profile-card__field">
              <label class="profile-card__label">Nombre Completo</label>
              <p class="profile-card__value">{{ fullName }}</p>
            </div>
            <div class="profile-card__field">
              <label class="profile-card__label">Correo Electrónico</label>
              <p class="profile-card__value">{{ userProfile?.email }}</p>
            </div>
            <div class="profile-card__field profile-card__field--full">
              <label class="profile-card__label">Número de Teléfono</label>
              <p class="profile-card__value">{{ userProfile?.phone }}</p>
            </div>
          </div>
        </section>

        <!-- Special Requirements Section -->
        <section class="requirements-section">
          <div class="requirements-section__header">
            <span class="material-symbols-outlined requirements-section__icon">notes</span>
            <h3 class="requirements-section__title">Requisitos Especiales</h3>
          </div>
          <div class="requirements-section__input-wrapper">
            <textarea 
              v-model="notes"
              class="requirements-section__textarea" 
              placeholder="Agregá cualquier instrucción o requisito específico para el profesional..."
            ></textarea>
          </div>
          <p class="requirements-section__hint">
            Opcional: Cualquier detalle que proporciones aquí se compartirá con el profesional asignado.
          </p>
        </section>

        <!-- Action Button -->
        <div class="details-view__actions">
          <button type="button" class="details-view__submit-btn" @click="handleConfirm">
            Confirmar y Continuar
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.details-view {
  background-color: var(--color-background);
  min-height: 100vh;
}

.details-view__container {
  max-width: 56rem; /* max-w-4xl */
  margin: 0 auto;
  padding: var(--space-12) var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

@media (min-width: 768px) {
  .details-view__container {
    padding: var(--space-16);
  }
}

/* ── Header ──────────────────────────────────────────────── */
.details-view__header {
  margin-bottom: var(--space-4);
}

.details-view__step {
  font-family: var(--font-family-label);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-secondary);
  margin-bottom: var(--space-4);
}

.details-view__title {
  font-family: var(--font-family-headline);
  font-size: 2.5rem;
  font-weight: 800; /* extrabold */
  line-height: 1;
  letter-spacing: -0.05em; /* tracking-tighter */
  color: var(--color-primary);
  margin: 0 0 var(--space-6) 0;
}

.details-view__subtitle {
  font-family: var(--font-family-body);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary); /* on-surface-variant approx */
  line-height: var(--line-height-loose);
  max-width: 42rem; /* max-w-2xl */
  margin: 0;
}

/* ── Loading ─────────────────────────────────────────────── */
.details-view__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) 0;
  color: var(--color-primary);
  gap: var(--space-4);
}

.details-view__spinner {
  font-size: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Content ─────────────────────────────────────────────── */
.details-view__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

/* ── Profile Card ────────────────────────────────────────── */
.profile-card {
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-3xl);
  padding: var(--space-10);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(192, 200, 204, 0.3); /* border-outline-variant/30 */
}

.profile-card__header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-12);
}

@media (min-width: 640px) {
  .profile-card__header {
    flex-direction: row;
  }
}

.profile-card__title {
  font-family: var(--font-family-headline);
  font-weight: 700;
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  margin: 0;
}

.profile-card__subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--space-1) 0 0 0;
}

.profile-card__edit-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-primary);
  font-weight: 700;
  font-size: var(--font-size-sm);
  background-color: #ffffff;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: 1px solid rgba(192, 200, 204, 0.5); /* border-outline-variant/50 */
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.profile-card__edit-btn:hover {
  opacity: 0.8;
}

.profile-card__edit-icon {
  font-size: 1.125rem; /* 18px */
}

.profile-card__grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--space-12);
  row-gap: var(--space-12);
}

@media (min-width: 768px) {
  .profile-card__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.profile-card__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.profile-card__field--full {
  grid-column: 1 / -1;
}

.profile-card__label {
  font-family: var(--font-family-label);
  font-size: 0.6875rem; /* 11px */
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-outline);
  font-weight: 700;
}

.profile-card__value {
  font-family: var(--font-family-headline);
  font-weight: 800; /* extrabold */
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  margin: 0;
}

/* ── Requirements Section ────────────────────────────────── */
.requirements-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.requirements-section__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.requirements-section__icon {
  color: var(--color-primary);
}

.requirements-section__title {
  font-family: var(--font-family-headline);
  font-weight: 700;
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  margin: 0;
}

.requirements-section__input-wrapper {
  position: relative;
}

.requirements-section__textarea {
  width: 100%;
  height: 10rem; /* h-40 */
  background-color: var(--color-surface-container-low);
  border: 1px solid rgba(192, 200, 204, 0.3);
  border-radius: var(--radius-2xl);
  padding: var(--space-5) var(--space-6);
  color: var(--color-text-primary);
  font-family: var(--font-family-body);
  font-size: var(--font-size-lg);
  resize: none;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.requirements-section__textarea::placeholder {
  color: var(--color-outline-variant);
}

.requirements-section__textarea:focus {
  border-color: rgba(0, 50, 86, 0.3); /* ring-primary/30 */
  box-shadow: 0 0 0 2px rgba(0, 50, 86, 0.1); /* focus:ring-2 focus:ring-primary/10 */
}

.requirements-section__hint {
  font-size: var(--font-size-sm);
  color: var(--color-outline);
  margin: 0;
}

/* ── Actions ─────────────────────────────────────────────── */
.details-view__actions {
  padding-top: var(--space-8);
  display: flex;
  justify-content: flex-end;
}

.details-view__submit-btn {
  background: var(--gradient-primary); /* Equivalent to bg-primary in Tailwind here, but let's use primary to match design precisely */
  background: var(--color-primary);
  color: #ffffff;
  font-family: var(--font-family-headline);
  font-weight: 700;
  padding: var(--space-4) var(--space-10);
  border-radius: var(--radius-xl);
  border: none;
  box-shadow: var(--shadow-primary-xl); /* shadow-lg shadow-primary/20 */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  transition: transform var(--transition-fast), opacity var(--transition-fast);
  font-size: var(--font-size-base);
}

.details-view__submit-btn:hover {
  transform: scale(1.02);
}

.details-view__submit-btn:active {
  transform: scale(1);
}
</style>
