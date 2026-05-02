<script setup lang="ts">
import { ref } from 'vue'
import AppInput from '@/components/AppInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppButton from '@/components/AppButton.vue'

const businessName = ref('Studio Hair')
const category = ref('estetica')
const previousCategory = ref('estetica')
const email = ref('studio@hair.com')
const phone = ref('11-4444-5555')

const showCustomCategoryModal = ref(false)
const customCategoryValue = ref('')

const categoryOptions = ref([
  { value: 'estetica', label: 'Estética' },
  { value: 'barberia', label: 'Barbería' },
  { value: 'salud', label: 'Salud' },
  { value: 'bienestar', label: 'Bienestar' },
  { value: 'otro', label: 'Otro' },
])

function onCategoryChange(newValue: string | number) {
  if (newValue === 'otro') {
    showCustomCategoryModal.value = true
  } else {
    previousCategory.value = String(newValue)
    category.value = String(newValue)
  }
}

function saveCustomCategory() {
  if (customCategoryValue.value.trim()) {
    const newVal = customCategoryValue.value.trim().toLowerCase().replace(/\s+/g, '-')
    // Evitar duplicados
    if (!categoryOptions.value.find(opt => opt.value === newVal)) {
      categoryOptions.value.splice(categoryOptions.value.length - 1, 0, {
        value: newVal,
        label: customCategoryValue.value.trim()
      })
    }
    category.value = newVal
    previousCategory.value = newVal
  } else {
    category.value = previousCategory.value
  }
  showCustomCategoryModal.value = false
  customCategoryValue.value = ''
}

function cancelCustomCategory() {
  category.value = previousCategory.value
  showCustomCategoryModal.value = false
  customCategoryValue.value = ''
}

function handleSubmit() {
  // TODO: implement save
  console.log('Guardando cambios:', {
    businessName: businessName.value,
    category: category.value,
    email: email.value,
    phone: phone.value
  })
}
</script>

<template>
  <div class="provider-view">
    <header class="provider-view__header">
      <div class="provider-view__header-content">
        <div class="provider-view__title-group">
          <h1 class="provider-view__title">Perfil del Negocio</h1>
          <p class="provider-view__subtitle">Actualiza la información pública y de contacto de tu establecimiento.</p>
        </div>
      </div>
    </header>

    <section class="provider-view__content-section">
      <div class="provider-view__content">
        <div class="provider-view__card">
          <div class="provider-view__card-header">
            <div class="provider-view__card-icon">
              <span class="material-symbols-outlined">storefront</span>
            </div>
            <div class="provider-view__card-title-group">
              <h3 class="provider-view__card-title">Datos del negocio</h3>
              <p class="provider-view__card-subtitle">Esta información será visible para tus clientes.</p>
            </div>
          </div>

          <form class="provider-view__form" @submit.prevent="handleSubmit">
            <div class="provider-view__form-grid">
              <AppInput v-model="businessName" label="Nombre del negocio" />
              <AppSelect :modelValue="category" @update:modelValue="onCategoryChange" label="Rubro" :options="categoryOptions" />
              <AppInput v-model="email" label="Email" type="email" />
              <AppInput v-model="phone" label="Teléfono" type="tel" />
            </div>

            <div class="provider-view__additional-details">
              <div class="provider-view__details-grid">
                <div class="provider-view__detail-section">
                  <h4 class="provider-view__detail-title">Ubicación principal</h4>
                  <div class="provider-view__location-card">
                    <span class="material-symbols-outlined provider-view__location-icon">location_on</span>
                    <div class="provider-view__location-info">
                      <p class="provider-view__location-address">Av. Santa Fe 1234, CABA</p>
                      <p class="provider-view__location-city">Buenos Aires, Argentina</p>
                    </div>
                  </div>
                </div>

                <div class="provider-view__detail-section">
                  <h4 class="provider-view__detail-title">Estado del perfil</h4>
                  <div class="provider-view__status">
                    <span class="provider-view__status-dot"></span>
                    <span class="provider-view__status-text">Perfil verificado y activo</span>
                  </div>
                  <p class="provider-view__status-desc">
                    Tu perfil ha sido verificado. Cualquier cambio importante en el rubro puede requerir una nueva validación.
                  </p>
                </div>
              </div>
            </div>

            <div class="provider-view__actions">
              <AppButton variant="outline">Descartar cambios</AppButton>
              <AppButton type="submit" variant="gradient">Guardar cambios</AppButton>
            </div>
          </form>
        </div>

        <div class="provider-view__bento">
          <div class="provider-view__bento-card provider-view__bento-card--primary">
            <div class="provider-view__bento-content">
              <h4 class="provider-view__bento-title">Mejora tu visibilidad</h4>
              <p class="provider-view__bento-desc">Completa la galería de fotos para que tus clientes puedan ver tus mejores trabajos.</p>
              <button class="provider-view__bento-btn" type="button">
                Subir fotos <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div class="provider-view__bento-image">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoVuP5G1-8OJ3AMdAp4e3KCeeyB9oKLMVKrKvcAMovUjN80m6ZDS7Uey8jYur9ljWLS03q3wfqKfya2ulrJS6MOKH_cp3N3SiJv7sqKPMi-L2X65sFiUC7zSD3GDIKOk-5cz3WAKTgHDaqiEMgOdKtvPb8e-CNLDNoPL3gWA5hIXJHtQKTMDAaRbuko5JattPTnPe0r8asZYth3gBlhWUipy1aq88SbcgDkzQTzH4ughrhu0VmMqMcAQcpOOI7bR5zPArAOEPzQ_4" alt="Decoration" />
            </div>
          </div>

          <div class="provider-view__bento-card provider-view__bento-card--secondary">
            <span class="provider-view__progress-value">85%</span>
            <p class="provider-view__progress-label">Perfil completado</p>
            <div class="provider-view__progress-bar">
              <div class="provider-view__progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Rubro Personalizado -->
    <div v-if="showCustomCategoryModal" class="provider-view__modal-overlay" @click.self="cancelCustomCategory">
      <div class="provider-view__modal">
        <h3 class="provider-view__modal-title">Rubro personalizado</h3>
        <p class="provider-view__modal-desc">
          Ingresa el rubro al que pertenece tu negocio.
        </p>
        
        <div class="provider-view__modal-body">
          <AppInput v-model="customCategoryValue" placeholder="Ej: Peluquería canina" @keyup.enter="saveCustomCategory" />
        </div>

        <div class="provider-view__modal-actions">
          <AppButton variant="outline" @click="cancelCustomCategory">Cancelar</AppButton>
          <AppButton variant="solid" @click="saveCustomCategory">Aplicar</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.provider-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-surface);
  font-family: var(--font-family-base);
}

.provider-view__header {
  padding: var(--space-12) var(--space-12) var(--space-8);
}

.provider-view__header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .provider-view__header-content {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.provider-view__title-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.provider-view__title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
  margin: 0;
}

.provider-view__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.provider-view__content-section {
  padding: 0 var(--space-12) var(--space-16);
}

.provider-view__content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.provider-view__card {
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-slow);
}

.provider-view__card-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.provider-view__card-icon {
  width: 54px;
  height: 54px;
  border-radius: var(--radius-xl);
  background-color: var(--color-primary-fixed);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.provider-view__card-icon .material-symbols-outlined {
  font-size: 30px;
}

.provider-view__card-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 0;
}

.provider-view__card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--space-2);
  margin-left: var(--space-0);
}

.provider-view__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.provider-view__form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6) var(--space-8);
}

@media (min-width: 768px) {
  .provider-view__form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.provider-view__additional-details {
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-surface-container);
}

.provider-view__details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: start;
}

@media (min-width: 768px) {
  .provider-view__details-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.provider-view__detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.provider-view__detail-title {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.provider-view__location-card {
  background-color: var(--color-surface-container-low);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.provider-view__location-icon {
  color: var(--color-primary);
}

.provider-view__location-address {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.provider-view__location-city {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.provider-view__status {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.provider-view__status-dot {
  display: flex;
  height: 12px;
  width: 12px;
  border-radius: var(--radius-full);
  background-color: #22c55e;
}

.provider-view__status-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.provider-view__status-desc {
  font-size: var(--font-size-sm );
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: var(--space-0);
}

.provider-view__actions {
  padding-top: var(--space-10);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-4);
}

.provider-view__bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .provider-view__bento {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .provider-view__bento-card--primary {
    grid-column: span 2;
  }
}

.provider-view__bento-card {
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  display: flex;
}

.provider-view__bento-card--primary {
  background: linear-gradient(to bottom right, rgba(210, 224, 253, 0.3), var(--color-surface-container));
  align-items: center;
  justify-content: space-between;
}

.provider-view__bento-content {
  max-width: 60%;
}

.provider-view__bento-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
}

.provider-view__bento-desc {
  font-size: var(--font-size-sm);
  color: var(--color-on-secondary-container);
}

.provider-view__bento-btn {
  margin-top: var(--space-4);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.provider-view__bento-btn:hover .material-symbols-outlined {
  transform: translateX(4px);
}

.provider-view__bento-btn .material-symbols-outlined {
  font-size: var(--font-size-sm);
  transition: transform var(--transition-fast);
}

.provider-view__bento-image {
  display: none;
}

@media (min-width: 640px) {
  .provider-view__bento-image {
    display: block;
  }
  
  .provider-view__bento-image img {
    width: 96px;
    opacity: 0.6;
  }
}

.provider-view__bento-card--secondary {
  background-color: var(--color-surface-container-highest);
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.provider-view__progress-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-1);
}

.provider-view__progress-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.provider-view__progress-bar {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  height: 8px;
  border-radius: var(--radius-full);
  margin-top: var(--space-4);
  overflow: hidden;
}

.provider-view__progress-fill {
  background-color: var(--color-primary);
  height: 100%;
  width: 85%;
  border-radius: var(--radius-full);
}

/* Modals */
.provider-view__modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.provider-view__modal {
  background: var(--color-surface-container-lowest, #fff);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
}

.provider-view__modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.provider-view__modal-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.provider-view__modal-body {
  margin-bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.provider-view__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: auto;
}
</style>
