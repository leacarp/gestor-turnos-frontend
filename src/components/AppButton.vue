<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'gradient' | 'solid' | 'ghost' | 'outline'
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  iconLeft?: string
  iconRight?: string
  isLoading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  return [
    `app-button--${props.variant ?? 'solid'}`,
    `app-button--${props.size ?? 'md'}`,
    { 'app-button--full-width': props.fullWidth },
    { 'app-button--loading': props.isLoading }
  ]
})

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.isLoading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    class="app-button"
    :class="buttonClasses"
    :type="type ?? 'button'"
    :disabled="disabled || isLoading"
    @click="handleClick"
  >
    <span v-if="isLoading" class="app-button__spinner" aria-hidden="true"></span>
    
    <span v-if="iconLeft && !isLoading" class="material-symbols-outlined app-button__icon" aria-hidden="true">
      {{ iconLeft }}
    </span>
    
    <span class="app-button__content">
      <slot />
    </span>
    
    <span v-if="iconRight" class="material-symbols-outlined app-button__icon" aria-hidden="true">
      {{ iconRight }}
    </span>
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-family-headline);
  font-weight: var(--font-weight-bold);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: transform var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast), opacity var(--transition-fast);
  text-align: center;
}

.app-button:active:not(:disabled) {
  transform: scale(0.98);
}

.app-button--full-width {
  width: 100%;
}

/* Tamaños */
.app-button--sm { 
  padding: var(--space-2) var(--space-4); 
  font-size: var(--font-size-sm); 
}
.app-button--md { 
  padding: var(--space-3) var(--space-6); 
  font-size: var(--font-size-base); 
}
.app-button--lg { 
  padding: var(--space-4) var(--space-10); 
  font-size: var(--font-size-lg); 
}

/* Variantes */
.app-button--gradient {
  background: var(--gradient-primary);
  color: #fff;
  box-shadow: var(--shadow-primary);
}
.app-button--gradient:hover:not(:disabled) {
  box-shadow: 0 6px 20px 0 rgba(0, 50, 86, 0.3);
  transform: scale(1.02);
}

.app-button--solid {
  background: var(--color-primary);
  color: #fff;
}
.app-button--solid:hover:not(:disabled) {
  background: var(--color-primary-container);
}

.app-button--ghost {
  background: transparent;
  color: var(--color-primary);
}
.app-button--ghost:hover:not(:disabled) {
  background: var(--color-surface-container);
}

.app-button--outline {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
  border: none;
}
.app-button--outline:hover:not(:disabled) {
  border-color: var(--color-primary);
  transform: scale(1.02);
}

/* Estados */
.app-button:disabled,
.app-button--loading {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Elementos internos */
.app-button__content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-button__icon {
  font-size: 1.25em; /* Escala con el botón */
}

/* Spinner */
.app-button__spinner {
  width: 1.25em;
  height: 1.25em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>