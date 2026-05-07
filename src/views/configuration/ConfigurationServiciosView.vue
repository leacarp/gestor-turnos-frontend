<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDeleteService(id: string) {
  router.push({ path: '/services', query: { delete: id } })
}
// Logic for Servicios
</script>

<template>
  <div class="config-servicios">
    <div class="config-servicios__container">
      
      <!-- Header Section -->
      <section class="config-servicios__header">
        <div class="config-servicios__header-text">
          <h2 class="config-servicios__title">Gestión de Servicios</h2>
          <p class="config-servicios__description">
            Configura tu catálogo de prestaciones, precios y duraciones para que tus clientes puedan reservar con precisión.
          </p>
        </div>
      </section>

      <!-- Table Focus Pane -->
      <div class="config-servicios__card">
        <table class="config-servicios__table">
          <thead>
            <tr class="config-servicios__table-head-row">
              <th class="config-servicios__th">Servicio</th>
              <th class="config-servicios__th">Categoría</th>
              <th class="config-servicios__th">Duración</th>
              <th class="config-servicios__th">Precio</th>
              <th class="config-servicios__th config-servicios__th--right"></th>
            </tr>
          </thead>
          <tbody class="config-servicios__table-body">
            
            <tr class="config-servicios__tr">
              <td class="config-servicios__td">
                <div class="config-servicios__item">
                  <div class="config-servicios__icon-wrapper">
                    <span class="material-symbols-outlined">content_cut</span>
                  </div>
                  <span class="config-servicios__item-name">Corte de cabello</span>
                </div>
              </td>
              <td class="config-servicios__td">
                <span class="config-servicios__tag">Belleza</span>
              </td>
              <td class="config-servicios__td">
                <div class="config-servicios__duration">
                  <span class="material-symbols-outlined config-servicios__duration-icon">schedule</span>
                  <span>45 min</span>
                </div>
              </td>
              <td class="config-servicios__td">
                <span class="config-servicios__price">$2.500</span>
              </td>
              <td class="config-servicios__td config-servicios__td--right">
                <button class="config-servicios__delete-btn" aria-label="Eliminar servicio" @click="goToDeleteService('1')">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>

            <tr class="config-servicios__tr">
              <td class="config-servicios__td">
                <div class="config-servicios__item">
                  <div class="config-servicios__icon-wrapper">
                    <span class="material-symbols-outlined">palette</span>
                  </div>
                  <span class="config-servicios__item-name">Corte + Color</span>
                </div>
              </td>
              <td class="config-servicios__td">
                <span class="config-servicios__tag">Belleza</span>
              </td>
              <td class="config-servicios__td">
                <div class="config-servicios__duration">
                  <span class="material-symbols-outlined config-servicios__duration-icon">schedule</span>
                  <span>120 min</span>
                </div>
              </td>
              <td class="config-servicios__td">
                <span class="config-servicios__price">$6.500</span>
              </td>
              <td class="config-servicios__td config-servicios__td--right">
                <button class="config-servicios__delete-btn" aria-label="Eliminar servicio" @click="goToDeleteService('1')">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>

            <tr class="config-servicios__tr">
              <td class="config-servicios__td">
                <div class="config-servicios__item">
                  <div class="config-servicios__icon-wrapper">
                    <span class="material-symbols-outlined">face</span>
                  </div>
                  <span class="config-servicios__item-name">Barba y Perfilado</span>
                </div>
              </td>
              <td class="config-servicios__td">
                <span class="config-servicios__tag">Belleza</span>
              </td>
              <td class="config-servicios__td">
                <div class="config-servicios__duration">
                  <span class="material-symbols-outlined config-servicios__duration-icon">schedule</span>
                  <span>30 min</span>
                </div>
              </td>
              <td class="config-servicios__td">
                <span class="config-servicios__price">$1.200</span>
              </td>
              <td class="config-servicios__td config-servicios__td--right">
                <button class="config-servicios__delete-btn" aria-label="Eliminar servicio" @click="goToDeleteService('1')">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>

            <tr class="config-servicios__tr">
              <td class="config-servicios__td">
                <div class="config-servicios__item">
                  <div class="config-servicios__icon-wrapper">
                    <span class="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <span class="config-servicios__item-name">Tratamiento Capilar</span>
                </div>
              </td>
              <td class="config-servicios__td">
                <span class="config-servicios__tag">Belleza</span>
              </td>
              <td class="config-servicios__td">
                <div class="config-servicios__duration">
                  <span class="material-symbols-outlined config-servicios__duration-icon">schedule</span>
                  <span>60 min</span>
                </div>
              </td>
              <td class="config-servicios__td">
                <span class="config-servicios__price">$4.000</span>
              </td>
              <td class="config-servicios__td config-servicios__td--right">
                <button class="config-servicios__delete-btn" aria-label="Eliminar servicio" @click="goToDeleteService('1')">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Bento Stats Section for Visual Polish -->
      <div class="config-servicios__bento">
        <div class="config-servicios__bento-card">
          <span class="config-servicios__bento-label">Servicios Totales</span>
          <div>
            <span class="config-servicios__bento-value">12</span>
            <p class="config-servicios__bento-subtext">+2 este mes</p>
          </div>
        </div>

        <div class="config-servicios__bento-card config-servicios__bento-card--span-2">
          <div class="config-servicios__bento-content">
            <h4 class="config-servicios__bento-title">Servicio más popular</h4>
            <p class="config-servicios__bento-desc">Corte + Color representa el 45% de tus ingresos.</p>
            <AppButton variant="ghost" iconRight="arrow_forward" style="margin-top: 1rem; padding: 0;">
              Ver estadísticas detalladas
            </AppButton>
          </div>
          <div class="config-servicios__bento-bg">
            <span class="material-symbols-outlined config-servicios__bento-bg-icon">trending_up</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.config-servicios__container {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.config-servicios__header {
  margin-bottom: var(--space-12);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: flex-end;
}

@media (min-width: 768px) {
  .config-servicios__header {
    grid-template-columns: 1fr 1fr;
  }
}

.config-servicios__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.025em;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.config-servicios__description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-loose);
  max-width: 28rem;
}

.config-servicios__header-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.config-servicios__btn-secondary {
  padding: var(--space-2) var(--space-6);
  background-color: transparent;
  color: var(--color-primary-container);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.config-servicios__btn-secondary:hover {
  background-color: var(--color-surface-container-high);
}

.config-servicios__btn-primary {
  padding: var(--space-2) var(--space-8);
  background: var(--gradient-primary);
  color: #fff;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-primary);
  transition: transform var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.config-servicios__btn-primary:hover {
  transform: scale(1.05);
}

.config-servicios__btn-icon {
  font-size: var(--font-size-sm);
}

/* Table Card */
.config-servicios__card {
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 1px solid rgba(192, 200, 204, 0.1);
}

.config-servicios__table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

.config-servicios__table-head-row {
  background-color: var(--color-surface-container-low);
}

.config-servicios__th {
  padding: var(--space-5) var(--space-6);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-disabled);
}

.config-servicios__th:first-child {
  padding-left: var(--space-8);
}

.config-servicios__th--right {
  text-align: right;
  padding-right: var(--space-8);
}

.config-servicios__table-body {
  /* No special styles */
}

.config-servicios__tr {
  transition: background-color var(--transition-fast);
  border-top: 1px solid var(--color-surface-container-low);
}

.config-servicios__tr:hover {
  background-color: rgba(243, 244, 245, 0.5); /* surface-container-low opacity */
}

.config-servicios__td {
  padding: var(--space-5) var(--space-6);
}

.config-servicios__td:first-child {
  padding-left: var(--space-8);
}

.config-servicios__td--right {
  text-align: right;
  padding-right: var(--space-8);
}

.config-servicios__item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.config-servicios__icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: rgba(0, 73, 122, 0.1); /* primary with opacity */
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-container);
}

.config-servicios__item-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.config-servicios__tag {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  background-color: var(--color-secondary-container);
  color: var(--color-on-secondary-container);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.config-servicios__duration {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
}

.config-servicios__duration-icon {
  font-size: var(--font-size-sm);
}

.config-servicios__price {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.config-servicios__delete-btn {
  padding: var(--space-2);
  color: var(--color-text-disabled);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.config-servicios__delete-btn:hover {
  color: var(--color-error);
  background-color: rgba(186, 26, 26, 0.1);
}

/* Bento Stats */
.config-servicios__bento {
  margin-top: var(--space-12);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .config-servicios__bento {
    grid-template-columns: repeat(3, 1fr);
  }
}

.config-servicios__bento-card {
  background-color: var(--color-surface-container);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 12rem;
  border: 1px solid rgba(192, 200, 204, 0.1);
  position: relative;
  overflow: hidden;
}

.config-servicios__bento-card--span-2 {
  background-color: var(--color-surface-container-lowest);
  grid-column: span 2;
  box-shadow: var(--shadow-sm);
}

.config-servicios__bento-label {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.config-servicios__bento-value {
  font-size: 3rem; /* 5xl */
  font-weight: 800;
  color: var(--color-primary-container);
}

.config-servicios__bento-subtext {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}

.config-servicios__bento-content {
  position: relative;
  z-index: 10;
}

.config-servicios__bento-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.config-servicios__bento-desc {
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}

.config-servicios__bento-link {
  margin-top: var(--space-4);
  color: var(--color-primary-container);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.config-servicios__bento-link:hover {
  text-decoration: underline;
}

.config-servicios__bento-link-icon {
  font-size: var(--font-size-sm);
}

.config-servicios__bento-bg {
  position: absolute;
  right: -2.5rem;
  bottom: -2.5rem;
  opacity: 0.1;
  transform: rotate(12deg) scale(1.5);
  pointer-events: none;
}

.config-servicios__bento-bg-icon {
  font-size: 160px;
  color: var(--color-primary-container);
}
</style>
