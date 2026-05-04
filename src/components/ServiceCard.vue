<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

export interface ServiceItem {
  id: string | number
  category: string
  title: string
  description: string
  duration: number // in minutes
  price: number
  colorTheme?: 'secondary' | 'tertiary' | 'primary' | 'surface' | 'default'
}

const props = withDefaults(defineProps<{
  service: ServiceItem
}>(), {})

const emit = defineEmits<{
  edit: [id: string | number]
  delete: [id: string | number]
}>()

const showOptions = ref(false)

const badgeClass = computed(() => {
  const theme = props.service.colorTheme || 'default'
  switch (theme) {
    case 'secondary': return 'service-card__badge--secondary'
    case 'tertiary': return 'service-card__badge--tertiary'
    case 'primary': return 'service-card__badge--primary'
    case 'surface': return 'service-card__badge--surface'
    default: return 'service-card__badge--default'
  }
})

function toggleOptions() {
  showOptions.value = !showOptions.value
}

function handleEdit() {
  showOptions.value = false
  emit('edit', props.service.id)
}

function handleDelete() {
  showOptions.value = false
  emit('delete', props.service.id)
}

function closeMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest(`.service-card__options-${props.service.id}`)) {
    showOptions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<template>
  <article class="service-card">
    <div class="service-card__header">
      <span class="service-card__badge" :class="badgeClass">
        {{ service.category }}
      </span>
      <div class="service-card__options-container" :class="[`service-card__options-${service.id}`]">
        <button class="service-card__options-btn" @click.stop="toggleOptions" aria-label="Opciones">
          <span class="material-symbols-outlined">more_vert</span>
        </button>
        <div v-if="showOptions" class="service-card__options-menu">
          <button class="service-card__menu-item" @click.stop="handleEdit">
            <span class="material-symbols-outlined">edit</span> Editar
          </button>
          <button class="service-card__menu-item service-card__menu-item--danger" @click.stop="handleDelete">
            <span class="material-symbols-outlined">delete</span> Eliminar
          </button>
        </div>
      </div>
    </div>

    <h3 class="service-card__title">{{ service.title }}</h3>
    <p class="service-card__description">{{ service.description }}</p>

    <div class="service-card__footer">
      <div class="service-card__duration">
        <span class="material-symbols-outlined service-card__duration-icon">schedule</span>
        <span class="service-card__duration-text">{{ service.duration }} min</span>
      </div>
      <div class="service-card__price">
        <span class="service-card__price-currency">$</span>
        {{ service.price }}
      </div>
    </div>

    <div class="service-card__hover-bar"></div>
  </article>
</template>

<style scoped>
.service-card {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-slow);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  border: 1px solid transparent;
}

.service-card:hover {
  box-shadow: 0 40px 40px -10px rgba(81, 95, 119, 0.06);
  transform: translateY(-2px);
}

.service-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.service-card__badge {
  padding: var(--space-1) var(--space-3);
  font-size: 0.625rem; /* 10px */
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-full);
}

.service-card__badge--default {
  background-color: var(--color-secondary-container);
  color: var(--color-on-secondary-container);
}

.service-card__badge--secondary {
  background-color: var(--color-secondary-fixed);
  color: var(--color-on-secondary-fixed-variant);
}

.service-card__badge--tertiary {
  background-color: var(--color-tertiary-fixed);
  color: var(--color-on-tertiary-fixed-variant);
}

.service-card__badge--primary {
  background-color: var(--color-primary-fixed);
  color: var(--color-on-primary-fixed-variant);
}

.service-card__badge--surface {
  background-color: var(--color-surface-container-highest);
  color: var(--color-text-secondary);
}

.service-card__options-btn {
  background: transparent;
  border: none;
  color: var(--color-outline);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.service-card__options-btn:hover {
  color: var(--color-text-primary);
  background-color: var(--color-surface-container-low);
}

.service-card__options-container {
  position: relative;
}

.service-card__options-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--space-2);
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(192, 200, 204, 0.2);
  display: flex;
  flex-direction: column;
  min-width: 140px;
  z-index: 10;
  overflow: hidden;
}

.service-card__menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.service-card__menu-item .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-text-secondary);
}

.service-card__menu-item:hover {
  background-color: var(--color-surface-container-low);
}

.service-card__menu-item--danger {
  color: var(--color-error);
}

.service-card__menu-item--danger .material-symbols-outlined {
  color: var(--color-error);
}

.service-card__menu-item--danger:hover {
  background-color: rgba(186, 26, 26, 0.1);
}

.service-card__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  transition: color var(--transition-fast);
}

.service-card:hover .service-card__title {
  color: var(--color-primary);
}

.service-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin-bottom: var(--space-6);
  flex: 1;
}

.service-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--space-6);
}

.service-card__duration {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
}

.service-card__duration-icon {
  font-size: 1.125rem;
}

.service-card__duration-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.service-card__price {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  display: flex;
  align-items: flex-start;
  gap: 2px;
}

.service-card__price-currency {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  margin-top: 4px;
}

.service-card__hover-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--color-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 500ms ease;
}

.service-card:hover .service-card__hover-bar {
  transform: scaleX(1);
}
</style>
