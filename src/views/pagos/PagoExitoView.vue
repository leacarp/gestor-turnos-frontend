<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleGoHome() {
  const providerId = localStorage.getItem('lastProviderId')
  if (providerId) {
    router.push({ name: 'booking-service', params: { providerId } })
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="pago-view">
    <div class="pago-view__container">
      <div class="pago-view__icon-wrap pago-view__icon-wrap--success">
        <span class="material-symbols-outlined pago-view__icon">check_circle</span>
      </div>
      
      <h1 class="pago-view__title">¡Pago Exitoso!</h1>
      <p class="pago-view__message">
        Hemos recibido tu pago correctamente y tu turno ha sido confirmado. Te enviamos un correo electrónico con todos los detalles.
      </p>

      <div class="pago-view__actions">
        <button class="pago-view__btn pago-view__btn--primary" @click="handleGoHome">
          Volver al Inicio
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pago-view {
  background-color: var(--color-background);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.pago-view__container {
  max-width: 32rem;
  width: 100%;
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-2xl);
  padding: var(--space-12) var(--space-8);
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(192, 200, 204, 0.3);
  animation: slide-up 0.4s ease both;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pago-view__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-xl);
}

.pago-view__icon-wrap--success {
  background: var(--gradient-primary);
  box-shadow: var(--shadow-xl), var(--shadow-primary-xl);
}

.pago-view__icon {
  font-size: 2.5rem;
  color: #ffffff;
}

.pago-view__title {
  font-family: var(--font-family-headline);
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-primary);
  margin: 0 0 var(--space-4) 0;
}

.pago-view__message {
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  margin: 0 0 var(--space-8) 0;
}

.pago-view__actions {
  display: flex;
  justify-content: center;
}

.pago-view__btn {
  font-family: var(--font-family-headline);
  font-weight: 700;
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-xl);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  transition: transform var(--transition-fast);
  font-size: var(--font-size-base);
  width: 100%;
  justify-content: center;
}

.pago-view__btn--primary {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: var(--shadow-primary-xl);
}

.pago-view__btn:hover {
  transform: scale(1.02);
}
</style>
