<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/AppButton.vue'

const router = useRouter()

function handleRetry() {
  router.push({ name: 'config-pagos' })
}
</script>

<template>
  <div class="mp-callback">
    <div class="mp-callback__card">
      <div class="mp-callback__icon-wrap mp-callback__icon-wrap--error">
        <span class="material-symbols-outlined mp-callback__icon">error</span>
      </div>

      <h1 class="mp-callback__title">Vinculación Cancelada o Fallida</h1>
      <p class="mp-callback__message">
        No se pudo completar la vinculación con Mercado Pago. Podés intentar nuevamente cuando lo desees desde la configuración.
      </p>

      <div class="mp-callback__actions">
        <AppButton variant="gradient" iconLeft="refresh" @click="handleRetry">
          Reintentar conexión
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mp-callback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: var(--space-8);
}

.mp-callback__card {
  max-width: 32rem;
  width: 100%;
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-2xl);
  padding: var(--space-12) var(--space-8);
  text-align: center;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(192, 200, 204, 0.3);
  animation: slide-up 0.4s ease both;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mp-callback__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
}

.mp-callback__icon-wrap--error {
  background: var(--color-error);
  box-shadow: var(--shadow-xl), 0 10px 15px -3px rgba(186, 26, 26, 0.3);
}

.mp-callback__icon {
  font-size: 2.75rem;
  color: #ffffff;
}

.mp-callback__title {
  font-family: var(--font-family-headline);
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-error);
  margin: 0 0 var(--space-4) 0;
}

.mp-callback__message {
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: var(--line-height-loose);
  margin: 0 0 var(--space-8) 0;
}

.mp-callback__actions {
  display: flex;
  justify-content: center;
}
</style>
