<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import AppInput from '@/components/AppInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppButton from '@/components/AppButton.vue'

const store = useOnboardingStore()

const categoryOptions = [
  { value: 'peluqueria', label: 'Peluquería' },
  { value: 'estetica', label: 'Centro de Estética' },
  { value: 'clinica', label: 'Clínica' },
  { value: 'spa', label: 'Spa' },
  { value: 'otros', label: 'Otros' },
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
            v-model="store.business.publicInfo"
            label="Nombre del negocio"
            iconRight="domain"
            placeholder="e.g., Barbería El Elegante"
          />
        </div>

        <AppSelect
          v-model="store.business.serviceType"
          label="Categoría"
          :options="categoryOptions"
          placeholder="Selecciona una opción"
        />

        <AppInput
          v-model="store.business.servicePrice"
          type="number"
          label="Precio de referencia del servicio"
          iconRight="payments"
          placeholder="Ej: 15000"
        />

        <div class="step-business__social-field">
          <label class="step-business__social-label">Instagram</label>
          <div class="step-business__social-input">
            <Icon icon="mdi:instagram" class="step-business__social-icon" />
            <input
              v-model="store.business.instagramUrl"
              type="url"
              class="step-business__social-native"
              placeholder="instagram.com/tu-negocio"
            />
          </div>
        </div>

        <div class="step-business__social-field">
          <label class="step-business__social-label">TikTok</label>
          <div class="step-business__social-input">
            <Icon icon="ic:baseline-tiktok" class="step-business__social-icon" />
            <input
              v-model="store.business.tiktokUrl"
              type="url"
              class="step-business__social-native"
              placeholder="tiktok.com/@tu-negocio"
            />
          </div>
        </div>

        <div class="step-business__full-width">
          <AppInput
            v-model="store.business.address"
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

.step-business__social-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.step-business__social-label {
  font-family: var(--font-family-label);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-left: var(--space-1);
}

.step-business__social-input {
  position: relative;
  display: flex;
  align-items: center;
}

.step-business__social-icon {
  position: absolute;
  left: var(--space-4);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-outline);
  pointer-events: none;
}

.step-business__social-native {
  width: 100%;
  font-family: var(--font-family-body);
  background-color: var(--color-surface-container-high);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  padding-left: var(--space-12);
  border: none;
  outline: none;
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.step-business__social-native:focus {
  background-color: var(--color-surface-container-lowest);
  box-shadow: 0 0 0 2px var(--color-primary-fixed-dim);
}

.step-business__social-native::placeholder {
  color: var(--color-outline-variant);
}

.step-business__advance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-6);
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-surface-container);
}

.step-business__advance-info {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  color: var(--color-primary);
}

.step-business__advance-title {
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-1);
}

.step-business__advance-summary {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
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

.step-business__modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--space-6);
}

.step-business__modal {
  width: 100%;
  max-width: 24rem;
  background: var(--color-background);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.step-business__modal-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--color-primary);
}

.step-business__modal-desc {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.step-business__modal-tabs {
  display: flex;
  gap: var(--space-2);
}

.step-business__modal-tab {
  flex: 1;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-surface-container);
  background: transparent;
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  cursor: pointer;
}

.step-business__modal-tab--active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-surface-container-lowest);
}

.step-business__modal-hint {
  margin: calc(var(--space-2) * -1) 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.step-business__modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: flex-end;
}
</style>
