<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/AppButton.vue'
import { useUserStore } from '@/stores/useUserStore'

const router = useRouter()
const userStore = useUserStore()

// Indica si aún estamos refrescando el perfil desde la BD
const isRefreshing = ref(true)

onMounted(async () => {
  // Al aterrizar en esta vista, el store puede tener datos viejos
  // (mpConnected = false). Forzamos un re-fetch para que quede
  // sincronizado con la BD, donde el backend ya guardó mpConnected = true.
  await userStore.fetchMe()
  isRefreshing.value = false
})

function handleGoToConfig() {
  router.push({ name: 'config-pagos' })
}
</script>

<template>
  <div class="mp-callback">
    <div class="mp-callback__card">

      <!-- Estado de carga mientras se refresca el perfil desde la BD -->
      <template v-if="isRefreshing">
        <div class="mp-callback__icon-wrap mp-callback__icon-wrap--loading">
          <span class="material-symbols-outlined mp-callback__icon mp-callback__icon--spin">sync</span>
        </div>
        <h1 class="mp-callback__title">Verificando vinculación...</h1>
        <p class="mp-callback__message">
          Estamos actualizando tu perfil. Por favor aguardá un momento.
        </p>
      </template>

      <!-- Pantalla de éxito una vez confirmado -->
      <template v-else>
        <div class="mp-callback__icon-wrap mp-callback__icon-wrap--success">
          <span class="material-symbols-outlined mp-callback__icon">check_circle</span>
        </div>
        <h1 class="mp-callback__title">¡Mercado Pago Conectado!</h1>
        <p class="mp-callback__message">
          Tu cuenta de Mercado Pago fue vinculada correctamente. A partir de ahora podrás recibir pagos y cobrar señas directamente en tu cuenta.
        </p>
        <div class="mp-callback__actions">
          <AppButton variant="gradient" iconLeft="arrow_back" @click="handleGoToConfig">
            Volver a Configuración
          </AppButton>
        </div>
      </template>

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

.mp-callback__icon-wrap--success {
  background: var(--gradient-primary);
  box-shadow: var(--shadow-xl), var(--shadow-primary-xl);
}

.mp-callback__icon {
  font-size: 2.75rem;
  color: #ffffff;
}

.mp-callback__title {
  font-family: var(--font-family-headline);
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-primary);
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

.mp-callback__icon-wrap--loading {
  background: var(--color-surface-container-low);
  box-shadow: var(--shadow-sm);
}

.mp-callback__icon--spin {
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
