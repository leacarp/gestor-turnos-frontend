<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import ServiceCard from '@/components/ServiceCard.vue'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import type { ServiceItem } from '@/components/ServiceCard.vue'
import { useServiciosStore } from '@/stores/useServiciosStore'
import { computeDepositAmount } from '@/types/servicios'
import { validateServiceForm, isServiceFormValid } from '@/utils/serviceFormValidation'

type ServiceDraft = Pick<ServiceItem, 'title' | 'category' | 'description' | 'duration' | 'price'>

const route = useRoute()
const router = useRouter()
const store = useServiciosStore()

const searchQuery = ref('')
const selectedCategory = ref('Todas las categorías')

const COLOR_THEMES = ['default', 'secondary', 'tertiary', 'primary', 'surface'] as const

const categories = computed(() => {
  const unique = [...new Set(store.items.map((s) => s.category))].sort()
  return ['Todas las categorías', ...unique]
})

const services = computed((): ServiceItem[] => {
  let list = store.items.map((s, index) => {
    const depositAmount = computeDepositAmount(s.price, store.depositPercent)

    return {
      id: s.id,
      title: s.name,
      category: s.category,
      description: s.description,
      duration: s.duration,
      price: s.price,
      colorTheme: COLOR_THEMES[index % COLOR_THEMES.length],
      depositAmount,
    }
  })

  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query),
    )
  }

  if (selectedCategory.value !== 'Todas las categorías') {
    list = list.filter((s) => s.category === selectedCategory.value)
  }

  return list
})

const hasAnyServices = computed(() => store.items.length > 0)
const isFilteredEmpty = computed(() => hasAnyServices.value && services.value.length === 0)

const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedService = ref<ServiceItem | null>(null)
const editingService = ref<ServiceDraft>({
  title: '',
  category: 'Cabello',
  description: '',
  duration: 60,
  price: 0,
})

const formError = ref<string | null>(null)

const isFormValid = computed(() => isServiceFormValid(editingService.value, store.depositPercent))

watch(editingService, () => {
  if (formError.value) {
    formError.value = validateServiceForm(editingService.value, store.depositPercent)
  }
}, { deep: true })

function handleNewService() {
  selectedService.value = null
  editingService.value = {
    title: '',
    category: categories.value[1] ?? 'Cabello',
    description: '',
    duration: 60,
    price: 0,
  }
  formError.value = null
  showEditModal.value = true
}

function handleEdit(id: string | number) {
  const srv = store.items.find((s) => s.id === id)
  if (!srv) return

  selectedService.value = services.value.find((s) => s.id === id) ?? null
  editingService.value = {
    title: srv.name,
    category: srv.category,
    description: srv.description,
    duration: srv.duration,
    price: srv.price,
  }
  formError.value = null
  showEditModal.value = true
}

async function saveEdit() {
  const validationError = validateServiceForm(editingService.value, store.depositPercent)
  if (validationError) {
    formError.value = validationError
    return
  }

  const dto = {
    name: editingService.value.title.trim(),
    description: editingService.value.description.trim(),
    duration: Number(editingService.value.duration),
    price: Number(editingService.value.price),
    category: editingService.value.category.trim(),
  }

  try {
    if (selectedService.value) {
      await store.update(String(selectedService.value.id), dto)
      toast.success('Cambios realizados')
    } else {
      await store.create(dto)
      toast.success('Servicio creado')
    }
    showEditModal.value = false
  } catch {
    formError.value = store.error
    toast.error(store.error ?? 'Error al guardar el servicio')
  }
}

function handleDelete(id: string | number) {
  const srv = services.value.find((s) => s.id === id)
  if (srv) {
    selectedService.value = srv
    showDeleteModal.value = true
  }
}

async function confirmDelete() {
  if (!selectedService.value) return
  try {
    await store.remove(String(selectedService.value.id))
    toast.success('Servicio eliminado')
    showDeleteModal.value = false
    selectedService.value = null

    if (route.query.delete) {
      router.replace({ path: route.path, query: {} })
    }
  } catch {
    toast.error(store.error ?? 'Error al eliminar el servicio')
  }
}

function cancelDelete() {
  showDeleteModal.value = false
  selectedService.value = null
  if (route.query.delete) {
    router.replace({ path: route.path, query: {} })
  }
}

onMounted(async () => {
  await store.fetchAll()

  if (route.query.delete) {
    handleDelete(route.query.delete as string)
  }
})
</script>

<template>
  <div class="services-view">
    <!-- Header Section -->
    <header class="services-view__header">
      <div class="services-view__header-content">
        <div class="services-view__title-group">
          <h1 class="services-view__title">Catálogo de Servicios</h1>
          <p class="services-view__subtitle">Gestiona los servicios que ofreces a tus clientes</p>
          <p v-if="store.depositPercent" class="services-view__subtitle">
            Seña fija activa: ${{ store.depositPercent?.toLocaleString('es-AR') }} por reserva
          </p>
        </div>
        <AppButton variant="gradient" iconLeft="add" @click="handleNewService">
          Nuevo servicio
        </AppButton>
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
      <p v-if="store.isLoading" class="services-view__subtitle">Cargando...</p>
      <p v-else-if="store.error" class="services-view__subtitle">{{ store.error }}</p>

      <div v-else-if="!hasAnyServices" class="services-view__grid">
        <div class="services-view__add-card" style="grid-column: 1 / -1; min-height: 200px;">
          <p class="services-view__add-card-title">No hay servicios creados</p>
          <p class="services-view__add-card-subtitle">Creá tu primer servicio para que tus clientes puedan reservar</p>
          <AppButton variant="gradient" iconLeft="add" @click="handleNewService">
            Nuevo servicio
          </AppButton>
        </div>
      </div>

      <p v-else-if="isFilteredEmpty" class="services-view__subtitle">No se encontraron servicios</p>

      <div v-else class="services-view__grid">
        <ServiceCard 
          v-for="service in services" 
          :key="service.id" 
          :service="service" 
          @edit="handleEdit"
          @delete="handleDelete"
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

    <!-- Modal Editar / Nuevo -->
    <div v-if="showEditModal" class="services-view__modal-overlay" @click.self="showEditModal = false">
      <div class="services-view__modal">
        <h3 class="services-view__modal-title">{{ selectedService ? 'Editar Servicio' : 'Nuevo Servicio' }}</h3>
        
        <div class="services-view__modal-body">
          <AppInput v-model="editingService.title" label="Nombre del servicio" />
          <AppInput v-model="editingService.category" label="Categoría" />
          <AppInput v-model="editingService.description" label="Descripción" />
          <div class="services-view__modal-row">
            <AppInput v-model="editingService.duration" type="number" label="Duración (min)" />
            <AppInput v-model="editingService.price" type="number" label="Precio ($)" />
          </div>
          <p v-if="formError" class="services-view__modal-desc" style="color: #ba1a1a; margin-bottom: 0;">
            {{ formError }}
          </p>
          <p
            v-if="store.depositPercent && Number(editingService.price) > 0"
            class="services-view__modal-desc"
          >
            Con tu seña fija de ${{ store.depositPercent?.toLocaleString('es-AR') }}:
            precio ${{ Number(editingService.price).toLocaleString('es-AR') }} —
            seña ${{ computeDepositAmount(Number(editingService.price), store.depositPercent)?.toLocaleString('es-AR') }}
          </p>
        </div>

        <div class="services-view__modal-actions">
          <AppButton variant="outline" @click="showEditModal = false">Cancelar</AppButton>
          <AppButton
            variant="solid"
            :disabled="!isFormValid || store.isSaving"
            :is-loading="store.isSaving"
            @click="saveEdit"
          >
            Guardar
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Modal Eliminar -->
    <div v-if="showDeleteModal" class="services-view__modal-overlay" @click.self="cancelDelete">
      <div class="services-view__modal">
        <h3 class="services-view__modal-title">Eliminar Servicio</h3>
        <p class="services-view__modal-desc">
          ¿Quieres eliminar el servicio: <strong>{{ selectedService?.title }}</strong>? Esta acción no se puede deshacer.
        </p>

        <div class="services-view__modal-actions">
          <AppButton variant="outline" @click="cancelDelete">Cancelar</AppButton>
          <AppButton
            style="background-color: rgba(186, 26, 26, 0.1); color: #ba1a1a; border: none;"
            :disabled="store.isSaving"
            :is-loading="store.isSaving"
            @click="confirmDelete"
          >
            Eliminar
          </AppButton>
        </div>
      </div>
    </div>

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
  margin: 0;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.services-view__subtitle {
  font-size: var(--font-size-lg);
  margin: 0;
  color: var(--color-text-secondary);
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

/* Modals */
.services-view__modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.services-view__modal {
  background: var(--color-surface-container-lowest, #fff);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
}

.services-view__modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.services-view__modal-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.services-view__modal-body {
  margin-bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.services-view__modal-row {
  display: flex;
  gap: var(--space-4);
}
.services-view__modal-row > * {
  flex: 1;
}

.services-view__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: auto;
}
</style>
