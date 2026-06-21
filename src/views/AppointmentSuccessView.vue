<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleGoHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="success-view">
    <div class="success-view__container">
      <div class="success-view__icon-wrap">
        <span class="material-symbols-outlined success-view__icon">check_circle</span>
      </div>
      
      <h1 class="success-view__title">¡Turno Confirmado!</h1>
      <p class="success-view__message">
        Tu reserva ha sido procesada con éxito. Te enviamos un correo electrónico con todos los detalles.
      </p>

      <div class="success-view__actions">
        <button class="success-view__btn" @click="handleGoHome">
          Volver al Inicio
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-view {
  background-color: var(--color-background);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.success-view__container {
  max-width: 32rem;
  width: 100%;
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-2xl);
  padding: var(--space-12) var(--space-8);
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(192, 200, 204, 0.3);
}

.success-view__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-xl), var(--shadow-primary-xl);
}

.success-view__icon {
  font-size: 2.5rem;
  color: #ffffff;
}

.success-view__title {
  font-family: var(--font-family-headline);
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-primary);
  margin: 0 0 var(--space-4) 0;
}

.success-view__message {
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  margin: 0 0 var(--space-8) 0;
}

.success-view__actions {
  display: flex;
  justify-content: center;
}

.success-view__btn {
  background: var(--color-primary);
  color: #ffffff;
  font-family: var(--font-family-headline);
  font-weight: 700;
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-xl);
  border: none;
  box-shadow: var(--shadow-primary-xl);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  transition: transform var(--transition-fast);
  font-size: var(--font-size-base);
  width: 100%;
  justify-content: center;
}

.success-view__btn:hover {
  transform: scale(1.02);
}
</style>
