<script setup lang="ts">
import { ref } from 'vue'
import ServiceCard from '@/components/ServiceCard.vue'
import type { ServiceItem } from '@/components/ServiceCard.vue'

const searchQuery = ref('')
const selectedCategory = ref('Todas las categorías')

const categories = [
  'Todas las categorías',
  'Cabello',
  'Uñas',
  'Spa',
  'Maquillaje'
]

const services = ref<ServiceItem[]>([
  {
    id: '1',
    category: 'Cabello',
    title: 'Corte de cabello',
    description: 'Corte profesional personalizado según la forma de tu rostro y últimas tendencias.',
    duration: 45,
    price: 35,
    colorTheme: 'default'
  },
  {
    id: '2',
    category: 'Cabello',
    title: 'Tinte completo',
    description: 'Coloración uniforme de raíz a puntas con productos premium de larga duración.',
    duration: 120,
    price: 85,
    colorTheme: 'tertiary'
  },
  {
    id: '3',
    category: 'Spa',
    title: 'Masaje Relax',
    description: 'Tratamiento relajante con aceites esenciales para liberar tensión muscular.',
    duration: 60,
    price: 60,
    colorTheme: 'secondary'
  },
  {
    id: '4',
    category: 'Uñas',
    title: 'Manicura Gel',
    description: 'Limpieza profunda y esmaltado semipermanente con acabado espejo.',
    duration: 90,
    price: 25,
    colorTheme: 'primary'
  },
  {
    id: '5',
    category: 'Tratamiento',
    title: 'Hidratación Profunda',
    description: 'Mascarilla intensiva reparadora para cabellos dañados o secos.',
    duration: 30,
    price: 40,
    colorTheme: 'surface'
  }
])

function handleNewService() {
  // TODO: Open modal
  console.log('Open new service modal')
}

function handleOptions(id: string | number) {
  console.log('Options for service', id)
}
</script>

<template>
  <div class="services-view">
    <!-- Header Section -->
    <header class="services-view__header">
      <div class="services-view__header-content">
        <div class="services-view__title-group">
          <h1 class="services-view__title">Catálogo de Servicios</h1>
          <p class="services-view__subtitle">Gestiona los servicios que ofreces a tus clientes</p>
        </div>
        <button class="services-view__add-btn" @click="handleNewService">
          <span class="material-symbols-outlined">add</span>
          Nuevo Servicio
        </button>
      </div>
    </header>

    <!-- Search & Filter Controls -->
    <section class="services-view__filters">
      <div class="services-view__filters-content">
        <div class="services-view__search">
          <span class="material-symbols-outlined services-view__search-icon">search</span>
          <input 
            v-model="searchQuery"
            type="text" 
            class="services-view__search-input" 
            placeholder="Buscar servicios..." 
          />
        </div>
        <div class="services-view__select-group">
          <span class="material-symbols-outlined services-view__select-icon">filter_list</span>
          <select v-model="selectedCategory" class="services-view__select">
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
          <span class="material-symbols-outlined services-view__select-arrow">expand_more</span>
        </div>
      </div>
    </section>

    <!-- Service Grid -->
    <section class="services-view__grid-section">
      <div class="services-view__grid">
        <ServiceCard 
          v-for="service in services" 
          :key="service.id" 
          :service="service" 
          @options="handleOptions"
        />

        <!-- Add More Placeholder Card -->
        <div class="services-view__add-card" @click="handleNewService">
          <div class="services-view__add-card-icon-wrapper">
            <span class="material-symbols-outlined services-view__add-card-icon">add_circle</span>
          </div>
          <div class="services-view__add-card-text">
            <h4 class="services-view__add-card-title">Agregar más</h4>
            <p class="services-view__add-card-subtitle">Expande tu oferta de servicios</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.services-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-surface);
  font-family: var(--font-family-base);
}

.services-view__header {
  padding: var(--space-12) var(--space-12) var(--space-8);
}

.services-view__header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .services-view__header-content {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.services-view__title-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.services-view__title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.services-view__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.services-view__add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: #ffffff;
  font-weight: var(--font-weight-bold);
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-primary);
  transition: all var(--transition-fast);
}

.services-view__add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px 0 rgba(0, 50, 86, 0.3);
}

.services-view__add-btn:active {
  transform: scale(0.95);
}

.services-view__filters {
  padding: 0 var(--space-12) var(--space-6);
}

.services-view__filters-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .services-view__filters-content {
    flex-direction: row;
  }
}

.services-view__search {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.services-view__search-icon {
  position: absolute;
  left: var(--space-4);
  color: var(--color-outline);
  transition: color var(--transition-fast);
  pointer-events: none;
}

.services-view__search:focus-within .services-view__search-icon {
  color: var(--color-primary);
}

.services-view__search-input {
  width: 100%;
  padding: var(--space-4) var(--space-4) var(--space-4) var(--space-12);
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-2xl);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--font-size-base);
  outline: none;
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.services-view__search-input::placeholder {
  color: var(--color-text-disabled);
}

.services-view__search-input:focus {
  background-color: var(--color-surface-container-lowest);
  box-shadow: 0 0 0 2px rgba(0, 50, 86, 0.2);
}

.services-view__select-group {
  position: relative;
  min-width: 220px;
  display: flex;
  align-items: center;
}

.services-view__select-icon {
  position: absolute;
  left: var(--space-4);
  color: var(--color-outline);
  pointer-events: none;
}

.services-view__select-arrow {
  position: absolute;
  right: var(--space-4);
  color: var(--color-outline);
  pointer-events: none;
}

.services-view__select {
  width: 100%;
  padding: var(--space-4) var(--space-10) var(--space-4) var(--space-12);
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-2xl);
  color: var(--color-text-secondary);
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.services-view__select:focus {
  background-color: var(--color-surface-container-lowest);
  box-shadow: 0 0 0 2px rgba(0, 50, 86, 0.2);
}

.services-view__grid-section {
  padding: 0 var(--space-12) var(--space-16);
}

.services-view__grid {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .services-view__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .services-view__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.services-view__add-card {
  background-color: rgba(242, 243, 253, 0.5); /* surface-container-low/50 */
  border: 2px dashed rgba(194, 198, 214, 0.3); /* outline-variant/30 */
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-4);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 240px;
}

.services-view__add-card:hover {
  border-color: rgba(0, 88, 190, 0.5); /* primary/50 */
  background-color: var(--color-surface-container-low);
}

.services-view__add-card-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-container-lowest);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.services-view__add-card-icon {
  font-size: 32px;
}

.services-view__add-card-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.services-view__add-card-title {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
}

.services-view__add-card-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
</style>
