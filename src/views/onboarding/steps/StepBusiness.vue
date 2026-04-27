<script setup lang="ts">
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import AppInput from '@/components/AppInput.vue'
import AppSelect from '@/components/AppSelect.vue'

const store = useOnboardingStore()

const categoryOptions = [
  { value: 'peluqueria', label: 'Peluquería' },
  { value: 'estetica', label: 'Centro de Estética' },
  { value: 'clinica', label: 'Clínica' },
  { value: 'spa', label: 'Spa' },
  { value: 'otros', label: 'Otros' }
]
</script>

<template>
  <div class="step-business">
    <div class="step-business__header">
      <h1 class="step-business__title">Datos de tu negocio</h1>
      <p class="step-business__subtitle">Cuéntanos sobre tu establecimiento para configurar tu agenda.</p>
    </div>

    <form class="step-business__form" @submit.prevent>
      <div class="step-business__grid">
        <div class="step-business__full-width">
          <AppInput
            v-model="store.business.nombre"
            label="Nombre del negocio"
            iconRight="domain"
            placeholder="e.g., Barbería El Elegante"
          />
        </div>

        <AppSelect
          v-model="store.business.categoria"
          label="Categoría"
          :options="categoryOptions"
          placeholder="Selecciona una opción"
        />

        <AppInput
          v-model="store.business.redSocial"
          label="Red Social o Sitio Web (Opcional)"
          iconRight="link"
          placeholder="instagram.com/tu-negocio"
        />

        <div class="step-business__full-width">
          <AppInput
            v-model="store.business.direccion"
            label="Ubicación / Dirección"
            iconRight="location_on"
            placeholder="Calle Ejemplo 123, Ciudad"
          />
          
          <div class="step-business__map">
            <div class="step-business__map-overlay">
              <div class="step-business__map-pin">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">location_on</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.step-business {
  width: 100%;
}

.step-business__header {
  margin-bottom: var(--space-10);
}

.step-business__title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  font-family: var(--font-family-headline);
  color: var(--color-primary);
  margin-bottom: var(--space-3);
  letter-spacing: -0.025em;
}

.step-business__subtitle {
  color: var(--color-secondary);
  font-size: var(--font-size-lg);
}

.step-business__form {
  width: 100%;
}

.step-business__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .step-business__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.step-business__full-width {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.step-business__map {
  margin-top: var(--space-4);
  height: 12rem;
  width: 100%;
  border-radius: var(--radius-2xl);
  background-color: var(--color-surface-container-high);
  position: relative;
  overflow: hidden;
}

.step-business__map::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAXFQJF3JamGWXuJ_KatsOFbVbQ9AHlLWP-IfelBp29EW3e9rUVCMr9ppirJ2qpGBlfIc7nfkvqVQLbtInswMjnzsDzNZ1XhxmjPycSS2-I7JdZpOX6LgHoi93rNq0VIl8GFlaGo3xV3YTH3M1vGh8Ktl3edcerCa3OaXNhzNjspYRE4KEtuvVOZoGONbgtfwlRZlIhhff6hhjVkkgGpABCPhJuMHR8LnU5bhIfe5CvZ469XXnP76Yi7FxaA7xSaJMkVFeNv6dCiCT7');
  background-size: cover;
  background-position: center;
  filter: grayscale(100%);
  opacity: 0.6;
}

.step-business__map-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-business__map-pin {
  background-color: var(--color-primary);
  color: #fff;
  padding: var(--space-3);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>