<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ClientCard from '@/components/ClientCard.vue'
import ClientDetailModal from '@/components/ClientDetailModal.vue'
import type { Client } from '@/components/ClientCard.vue'
import { dashboardService } from '@/services/dashboardService'

// 12 divide exacto por 1, 2 y 3, que son las columnas del grid en cada
// breakpoint: así la última fila nunca queda con huecos.
const PAGE_SIZE = 12

const allClients  = ref<Client[]>([])
const isLoading   = ref(true)
const error       = ref<string | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)
const selectedClient = ref<Client | null>(null)

onMounted(async () => {
  try {
    const data = await dashboardService.getClientes()
    // Los turnos de invitado pueden llegar sin teléfono o sin nombre: normalizamos
    // a string acá para que el filtro y las cards nunca vean undefined.
    allClients.value = data.map(c => ({
      id:          c.id,
      name:        c.name  ?? '',
      email:       c.email ?? '',
      phone:       c.phone ?? '',
      tipo:        c.tipo === 'REGISTRADO' ? 'REGISTRADO' : 'INVITADO',
      turnosCount: c.turnosCount ?? 0,
      ultimoTurno: c.ultimoTurno ?? null,
    }))
  } catch {
    error.value = 'No se pudieron cargar los clientes.'
  } finally {
    isLoading.value = false
  }
})

// Al escribir en el buscador, volvemos a la primera página
function onSearch() {
  currentPage.value = 1
}

const filteredClients = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return allClients.value
  return allClients.value.filter(c =>
    (c.name  ?? '').toLowerCase().includes(q) ||
    (c.email ?? '').toLowerCase().includes(q) ||
    (c.phone ?? '').includes(q),
  )
})

const totalPages = computed(() => Math.ceil(filteredClients.value.length / PAGE_SIZE))

const pagedClients = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredClients.value.slice(start, start + PAGE_SIZE)
})

function goTo(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// Páginas visibles: máximo 5 botones con elipsis
const visiblePages = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  if (cur > 3) pages.push('...')
  for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})
</script>

<template>
  <div class="clients-view">
    <!-- Header -->
    <header class="clients-view__header">
      <div class="clients-view__header-content">
        <div class="clients-view__title-group">
          <h1 class="clients-view__title">Clientes</h1>
          <p class="clients-view__subtitle">Gestiona la información y el historial de tus clientes</p>
        </div>
        <div v-if="!isLoading && !error" class="clients-view__count">
          {{ filteredClients.length }} cliente{{ filteredClients.length !== 1 ? 's' : '' }}
        </div>
      </div>
    </header>

    <!-- Search -->
    <section class="clients-view__filters">
      <div class="clients-view__filters-content">
        <div class="clients-view__search">
          <span class="material-symbols-outlined clients-view__search-icon">search</span>
          <input
            v-model="searchQuery"
            type="text"
            class="clients-view__search-input"
            placeholder="Buscar por nombre, email o teléfono…"
            @input="onSearch"
          />
          <button
            v-if="searchQuery"
            class="clients-view__search-clear"
            @click="searchQuery = ''; onSearch()"
            title="Limpiar búsqueda"
          >
            <span class="material-symbols-outlined" style="font-size:18px">close</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="isLoading" class="clients-view__loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
      <p>Cargando clientes…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="clients-view__empty">
      <span class="material-symbols-outlined clients-view__empty-icon">error</span>
      <p>{{ error }}</p>
    </div>

    <template v-else>
      <!-- Grid -->
      <section class="clients-view__grid-section">
        <div v-if="pagedClients.length > 0" class="clients-view__grid">
          <ClientCard
            v-for="client in pagedClients"
            :key="client.id"
            :client="client"
            @select="selectedClient = client"
          />
        </div>

        <div v-else class="clients-view__empty">
          <span class="material-symbols-outlined clients-view__empty-icon">group_off</span>
          <p>No se encontraron clientes que coincidan con la búsqueda.</p>
        </div>
      </section>

      <!-- Paginación -->
      <nav v-if="totalPages > 1" class="pagination" aria-label="Paginación de clientes">
        <button
          class="pagination__btn pagination__btn--arrow"
          :disabled="currentPage === 1"
          @click="goTo(currentPage - 1)"
          aria-label="Página anterior"
        >
          <span class="material-symbols-outlined" style="font-size:18px">chevron_left</span>
        </button>

        <template v-for="page in visiblePages" :key="String(page)">
          <span v-if="page === '...'" class="pagination__ellipsis">…</span>
          <button
            v-else
            class="pagination__btn"
            :class="{ 'pagination__btn--active': page === currentPage }"
            @click="goTo(page as number)"
          >
            {{ page }}
          </button>
        </template>

        <button
          class="pagination__btn pagination__btn--arrow"
          :disabled="currentPage === totalPages"
          @click="goTo(currentPage + 1)"
          aria-label="Página siguiente"
        >
          <span class="material-symbols-outlined" style="font-size:18px">chevron_right</span>
        </button>
      </nav>

      <!-- Info de página -->
      <p v-if="filteredClients.length > 0" class="pagination__info">
        Mostrando {{ (currentPage - 1) * PAGE_SIZE + 1 }}–{{ Math.min(currentPage * PAGE_SIZE, filteredClients.length) }}
        de {{ filteredClients.length }} clientes
      </p>
    </template>

    <ClientDetailModal
      v-if="selectedClient"
      :client="selectedClient"
      @close="selectedClient = null"
    />
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

/* ── Header ───────────────────────────────────────────── */
.clients-view__header {
  padding: var(--page-padding-top) var(--page-padding-x) var(--space-6);
}

.clients-view__header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
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
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
  margin: 0;
}

.clients-view__subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

@media (min-width: 768px) {
  .clients-view__title {
    font-size: var(--font-size-3xl);
  }

  .clients-view__subtitle {
    font-size: var(--font-size-lg);
  }
}

.clients-view__count {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-on-surface-variant);
  background-color: var(--color-surface-container);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

/* ── Search ───────────────────────────────────────────── */
.clients-view__filters {
  padding: 0 var(--page-padding-x) var(--space-6);
}

.clients-view__filters-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.clients-view__search {
  position: relative;
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
  font-size: 20px;
}

.clients-view__search:focus-within .clients-view__search-icon {
  color: var(--color-primary);
}

.clients-view__search-input {
  width: 100%;
  padding: var(--space-3) var(--space-10) var(--space-3) var(--space-12);
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--font-size-base);
  outline: none;
  transition: box-shadow var(--transition-fast), background-color var(--transition-fast);
}

.clients-view__search-input::placeholder {
  color: var(--color-text-disabled);
}

.clients-view__search-input:focus {
  box-shadow: 0 0 0 2px rgba(0, 50, 86, 0.15);
  background-color: var(--color-surface-container-lowest);
}

.clients-view__search-clear {
  position: absolute;
  right: var(--space-3);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-on-surface-variant);
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: var(--radius-full);
  transition: color var(--transition-fast);
}

.clients-view__search-clear:hover {
  color: var(--color-on-surface);
}

/* ── Loading / Error ──────────────────────────────────── */
.clients-view__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-16);
  color: var(--color-on-surface-variant);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spin { animation: spin 1s linear infinite; }

/* ── Grid ─────────────────────────────────────────────── */
.clients-view__grid-section {
  padding: 0 var(--page-padding-x) var(--space-8);
}

.clients-view__grid {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .clients-view__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1280px) {
  .clients-view__grid { grid-template-columns: repeat(3, 1fr); }
}

/* ── Empty ────────────────────────────────────────────── */
.clients-view__empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-10) var(--space-4);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-2xl);
  color: var(--color-text-secondary);
  text-align: center;
  max-width: var(--container-max-width);
  margin: 0 var(--page-padding-x);
}

@media (min-width: 768px) {
  .clients-view__empty {
    padding: var(--space-16);
  }
}

.clients-view__empty-icon {
  font-size: 48px;
  color: var(--color-outline-variant);
}

/* ── Pagination ───────────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Con muchas páginas los botones no entran en una fila de 375px */
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-4) var(--page-padding-x) 0;
}

.pagination__btn {
  min-width: 40px;
  height: 40px;
  padding: 0 var(--space-2);
  border: 1px solid var(--color-surface-container);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.pagination__btn:hover:not(:disabled) {
  background-color: var(--color-primary-fixed);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination__btn--active {
  background-color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
  color: #fff !important;
  font-weight: var(--font-weight-bold);
}

.pagination__btn--arrow {
  color: var(--color-on-surface-variant);
}

.pagination__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pagination__ellipsis {
  color: var(--color-on-surface-variant);
  padding: 0 var(--space-1);
  font-size: var(--font-size-sm);
  user-select: none;
}

.pagination__info {
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-on-surface-variant);
  padding: var(--space-3) 0 var(--space-8);
  margin: 0;
}
</style>
