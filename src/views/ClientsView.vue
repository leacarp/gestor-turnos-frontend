<script setup lang="ts">
import { ref, computed } from 'vue'
import ClientCard from '@/components/ClientCard.vue'
import type { Client } from '@/components/ClientCard.vue'

// Mock data based on the design reference
const mockClients: Client[] = [
  {
    id: 1,
    name: 'María López',
    email: 'maria@email.com',
    phone: '11-2345-6789',
    appointmentsCount: 12
  },
  {
    id: 2,
    name: 'Juan Pérez',
    email: 'juan@email.com',
    phone: '11-9876-5432',
    appointmentsCount: 8
  },
  {
    id: 3,
    name: 'Ana García',
    email: 'ana@email.com',
    phone: '11-5555-1234',
    appointmentsCount: 5
  },
  {
    id: 4,
    name: 'Carlos Ruiz',
    email: 'carlos@email.com',
    phone: '11-4444-5678',
    appointmentsCount: 3
  }
]

const searchQuery = ref('')
const clients = ref<Client[]>(mockClients)

const filteredClients = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return clients.value
  
  return clients.value.filter(client => 
    client.name.toLowerCase().includes(query) ||
    client.email.toLowerCase().includes(query) ||
    client.phone.includes(query)
  )
})
</script>

<template>
  <div class="clients-view">
    <!-- Header Section -->
    <header class="clients-view__header">
      <div class="clients-view__header-content">
        <div class="clients-view__title-group">
          <h1 class="clients-view__title">Clientes</h1>
          <p class="clients-view__subtitle">Gestiona la información y el historial de tus clientes</p>
        </div>
      </div>
    </header>

    <!-- Search & Filter Controls -->
    <section class="clients-view__filters">
      <div class="clients-view__filters-content">
        <div class="clients-view__search">
          <span class="material-symbols-outlined clients-view__search-icon">search</span>
          <input 
            v-model="searchQuery"
            type="text" 
            class="clients-view__search-input" 
            placeholder="Buscar cliente por nombre, email o teléfono..." 
          />
        </div>
      </div>
    </section>

    <!-- Client Grid -->
    <section class="clients-view__grid-section">
      <div class="clients-view__grid">
        <ClientCard
          v-for="client in filteredClients"
          :key="client.id"
          :client="client"
        />
      </div>

      <div v-if="filteredClients.length === 0" class="clients-view__empty">
        <span class="material-symbols-outlined clients-view__empty-icon">group_off</span>
        <p>No se encontraron clientes que coincidan con la búsqueda.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.clients-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-surface);
  font-family: var(--font-family-base);
}

/* ── Header ──────────────────────────────────────────── */
.clients-view__header {
  padding: var(--space-12) var(--space-12) var(--space-8);
}

.clients-view__header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .clients-view__header-content {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.clients-view__title-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.clients-view__title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
  margin: 0;
}

.clients-view__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* ── Filters & Search ────────────────────────────────── */
.clients-view__filters {
  padding: 0 var(--space-12) var(--space-6);
}

.clients-view__filters-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.clients-view__search {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  max-width: 480px;
}

.clients-view__search-icon {
  position: absolute;
  left: var(--space-4);
  color: var(--color-outline);
  transition: color var(--transition-fast);
  pointer-events: none;
}

.clients-view__search:focus-within .clients-view__search-icon {
  color: var(--color-primary);
}

.clients-view__search-input {
  width: 100%;
  padding: var(--space-4) var(--space-4) var(--space-4) var(--space-12);
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--font-size-base);
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.clients-view__search-input::placeholder {
  color: var(--color-text-disabled);
}

.clients-view__search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 50, 86, 0.1);
  background-color: var(--color-surface-container-lowest);
}

/* ── Grid ────────────────────────────────────────────── */
.clients-view__grid-section {
  padding: 0 var(--space-12) var(--space-16);
}

.clients-view__grid {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 768px) {
  .clients-view__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .clients-view__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ── Empty State ─────────────────────────────────────── */
.clients-view__empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-16);
  background-color: transparent;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-2xl);
  color: var(--color-text-secondary);
  font-family: var(--font-family-body);
  text-align: center;
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.clients-view__empty-icon {
  font-size: 48px;
  color: var(--color-outline-variant);
}
</style>
