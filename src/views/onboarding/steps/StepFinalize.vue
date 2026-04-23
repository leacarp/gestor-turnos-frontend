<script setup lang="ts">
import { useOnboardingStore } from '@/stores/useOnboardingStore'

const store = useOnboardingStore()
</script>

<template>
  <div class="step-finalize">
    <div class="step-finalize__grid">
      <!-- Decorative Column -->
      <div class="step-finalize__decor">
        <div class="step-finalize__decor-wrapper">
          <div class="step-finalize__decor-bg"></div>
          <div class="step-finalize__decor-circle">
            <div class="step-finalize__check">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content Column -->
      <div class="step-finalize__content">
        <div class="step-finalize__header">
          <h2 class="step-finalize__title">¡Todo listo para empezar!</h2>
          <p class="step-finalize__subtitle">Tu cuenta ha sido configurada con éxito. Ya puedes empezar a gestionar tus turnos y clientes.</p>
        </div>
        
        <!-- Summary Bento Card -->
        <div class="step-finalize__bento">
          <div class="step-finalize__bento-header">
            <div>
              <p class="step-finalize__bento-label">Resumen del Negocio</p>
              <h3 class="step-finalize__bento-title">{{ store.business.nombre || 'Sin nombre' }}</h3>
            </div>
            <span class="step-finalize__bento-badge">Verificado</span>
          </div>
          
          <div class="step-finalize__bento-details">
            <div class="step-finalize__bento-detail">
              <p class="step-finalize__detail-label">Categoría</p>
              <p class="step-finalize__detail-value">{{ store.business.categoria || 'No especificada' }}</p>
            </div>
            <div class="step-finalize__bento-detail">
              <p class="step-finalize__detail-label">Ubicación</p>
              <p class="step-finalize__detail-value">{{ store.business.direccion || 'No especificada' }}</p>
            </div>
          </div>
        </div>
        
        <div class="step-finalize__info">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">info</span>
          <p>Tu panel de control se actualizará con datos en tiempo real una vez que recibas tu primer turno.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-finalize {
  width: 100%;
}

.step-finalize__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12);
  align-items: center;
}

@media (min-width: 768px) {
  .step-finalize__grid {
    grid-template-columns: repeat(12, 1fr);
  }
}

.step-finalize__decor {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 768px) {
  .step-finalize__decor {
    grid-column: span 5;
  }
}

.step-finalize__decor-wrapper {
  position: relative;
}

.step-finalize__decor-bg {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 50, 86, 0.1);
  border-radius: var(--radius-full);
  filter: blur(24px);
  transition: background-color var(--transition-base);
}
.step-finalize__decor-wrapper:hover .step-finalize__decor-bg {
  background-color: rgba(0, 50, 86, 0.2);
}

.step-finalize__decor-circle {
  position: relative;
  width: 16rem;
  height: 16rem;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-container-low);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

@media (min-width: 768px) {
  .step-finalize__decor-circle {
    width: 20rem;
    height: 20rem;
  }
}

.step-finalize__decor-circle::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDcnEKsueMJq_3a_SVsrKQm10s_0aJZK45XUH1dtQSR1-i6pN-U2An-b3a_Lq8MkuQfwwhl8ZZA0SXoH5Xcr3jB0--zXiXDUnkP9b3hSMgqx_QIwK56jGJ7NTHM5csaLQJl5zU0d1pq25mkA1HSg_uLXC5RyQO4HJm7l3UaGO437X4zYQzDEcV0co98GetX05b51qsp6IELp5hyFEZKo6IvEK7dA-l--8K9q8hQFh4tCpV0jQvdBkcTqvWbi_rsV8cz8ctxdz9e9ozu');
  background-size: cover;
  background-position: center;
  filter: grayscale(100%);
  opacity: 0.2;
}

.step-finalize__check {
  width: 8rem;
  height: 8rem;
  background: var(--gradient-primary);
  border-radius: var(--radius-3xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 25px -5px rgba(0, 50, 86, 0.3);
  z-index: 10;
}

@media (min-width: 768px) {
  .step-finalize__check {
    width: 10rem;
    height: 10rem;
  }
}

.step-finalize__check .material-symbols-outlined {
  color: #fff;
  font-size: 3.75rem;
}

@media (min-width: 768px) {
  .step-finalize__check .material-symbols-outlined {
    font-size: 6rem;
  }
}

.step-finalize__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .step-finalize__content {
    grid-column: span 7;
  }
}

.step-finalize__title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  font-family: var(--font-family-headline);
  color: var(--color-primary);
  letter-spacing: -0.025em;
  line-height: var(--line-height-tight);
}

@media (min-width: 768px) {
  .step-finalize__title {
    font-size: 3rem;
  }
}

.step-finalize__subtitle {
  margin-top: var(--space-6);
  font-size: var(--font-size-xl);
  color: var(--color-secondary);
  font-weight: 300;
  max-width: 32rem;
}

.step-finalize__bento {
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  border-left: 4px solid var(--color-primary);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.step-finalize__bento-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.step-finalize__bento-label {
  font-size: 0.625rem;
  font-family: var(--font-family-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-secondary);
  margin-bottom: var(--space-1);
}

.step-finalize__bento-title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-primary);
}

.step-finalize__bento-badge {
  background-color: var(--color-primary);
  color: #fff;
  font-size: 0.625rem;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.step-finalize__bento-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(64, 72, 76, 0.1);
}

.step-finalize__detail-label {
  font-size: 0.625rem;
  font-family: var(--font-family-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-outline);
}

.step-finalize__detail-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.step-finalize__info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-secondary);
}

.step-finalize__info .material-symbols-outlined {
  color: var(--color-primary);
}
</style>