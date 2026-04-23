<script setup lang="ts">
import { computed } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
}

const props = defineProps<{
  modelValue: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  iconLeft?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = computed(() => props.id || `select-${Math.random().toString(36).slice(2, 9)}`)

function handleSelect(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="app-select" :class="{ 'app-select--error': error, 'app-select--disabled': disabled }">
    <label v-if="label" :for="inputId" class="app-select__label">
      {{ label }}
      <span v-if="required" class="app-select__required">*</span>
    </label>
    
    <div class="app-select__wrapper">
      <span v-if="iconLeft" class="material-symbols-outlined app-select__icon app-select__icon--left" aria-hidden="true">
        {{ iconLeft }}
      </span>

      <select
        :id="inputId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        class="app-select__field"
        :class="{
          'app-select__field--has-icon-left': iconLeft,
          'app-select__field--placeholder': !modelValue
        }"
        @change="handleSelect"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <span class="material-symbols-outlined app-select__icon app-select__icon--right" aria-hidden="true">
        expand_more
      </span>
    </div>

    <span v-if="error" class="app-select__error-msg">{{ error }}</span>
  </div>
</template>

<style scoped>
.app-select {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.app-select__label {
  font-family: var(--font-family-label);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-left: var(--space-1);
}

.app-select__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.app-select__icon {
  position: absolute;
  color: var(--color-outline);
  pointer-events: none;
}

.app-select__icon--left {
  left: var(--space-4);
}

.app-select__icon--right {
  right: var(--space-4);
}

.app-select__field {
  width: 100%;
  appearance: none;
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-4) var(--space-12) var(--space-4) var(--space-6);
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
  cursor: pointer;
}

.app-select__field--placeholder {
  color: var(--color-outline-variant);
}

.app-select__field:focus {
  background-color: var(--color-surface-container-lowest);
  box-shadow: 0 0 0 2px var(--color-primary-fixed-dim);
}

.app-select__field--has-icon-left {
  padding-left: var(--space-12);
}

.app-select--error .app-select__field {
  box-shadow: 0 0 0 2px var(--color-error);
}

.app-select__error-msg {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-left: var(--space-1);
}

.app-select--disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>