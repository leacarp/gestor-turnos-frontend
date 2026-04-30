<script setup lang="ts">
import { ref, computed } from 'vue'
import AppInput from '@/components/AppInput.vue'
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
    <header class="clients-view__header">
      <h1 class="clients-view__title">Clientes</h1>
    </header>

    <div class="clients-view__toolbar">
      <div class="clients-view__search">
        <AppInput
          v-model="searchQuery"
          placeholder="Buscar cliente..."
          icon-left="search"
          variant="outline"
          class="clients-view__search-input"
        />
      </div>
    </div>

    <div class="clients-view__grid">
      <ClientCard
        v-for="client in filteredClients"
        :key="client.id"
        :client="client"
      />
    </div>

    <div v-if="filteredClients.length === 0" class="clients-view__empty">
      <p>No se encontraron clientes que coincidan con la búsqueda.</p>
    </div>
  </div>
</template>

<style scoped>
.clients-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-8);
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
}

.clients-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clients-view__title {
  font-family: var(--font-family-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.clients-view__toolbar {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-2);
}

.clients-view__search {
  width: 100%;
  max-width: 400px;
}

/* Override AppInput border-radius to match design if needed, 
   though the variant="outline" might be enough */
:deep(.clients-view__search-input .app-input__field) {
  border-radius: var(--radius-md);
}

.clients-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-6);
}

.clients-view__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-12);
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
  color: var(--color-text-secondary);
  font-family: var(--font-family-body);
}

@media (max-width: 768px) {
  .clients-view__grid {
    grid-template-columns: 1fr;
  }
  
  .clients-view__search {
    max-width: 100%;
  }
}
</style>
