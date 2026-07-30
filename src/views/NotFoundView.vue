<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Página no encontrada</h2>
      <p class="error-message">
        La URL a la que intentas acceder no existe o ha sido eliminada.
      </p>
      <div class="not-found-actions">
        <AppButton variant="gradient" @click="goBack">
          Volver atrás
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppButton from '@/components/AppButton.vue'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: system-ui, -apple-system, sans-serif;
}

.not-found-content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 400px;
  width: 100%;
}

.error-code {
  font-size: 6rem;
  font-weight: 800;
  color: var(--color-primary);
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #6b7280;
  margin-bottom: 2rem;
}

.not-found-actions {
  display: flex;
  justify-content: center;
}
</style>