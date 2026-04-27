<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  iconLeft?: string
  iconRight?: string
  error?: string
  disabled?: boolean
  required?: boolean
  id?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const isPasswordVisible = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type || 'text'
})

const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2, 9)}`)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<template>
  <div class="app-input" :class="{ 'app-input--error': error, 'app-input--disabled': disabled }">
    <label v-if="label" :for="inputId" class="app-input__label">
      {{ label }}
      <span v-if="required" class="app-input__required">*</span>
    </label>
    
    <div class="app-input__wrapper">
      <span v-if="iconLeft" class="material-symbols-outlined app-input__icon app-input__icon--left" aria-hidden="true">
        {{ iconLeft }}
      </span>

      <input
        :id="inputId"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="app-input__field"
        :class="{
          'app-input__field--has-icon-left': iconLeft,
          'app-input__field--has-icon-right': iconRight || type === 'password',
        }"
        @input="handleInput"
      />

      <button
        v-if="type === 'password'"
        type="button"
        class="app-input__icon-btn app-input__icon--right"
        @click="togglePasswordVisibility"
        :aria-label="isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
      >
        <span class="material-symbols-outlined">
          {{ isPasswordVisible ? 'visibility_off' : 'visibility' }}
        </span>
      </button>
      <span v-else-if="iconRight" class="material-symbols-outlined app-input__icon app-input__icon--right" aria-hidden="true">
        {{ iconRight }}
      </span>
    </div>

    <span v-if="error" class="app-input__error-msg">{{ error }}</span>
  </div>
</template>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.app-input__label {
  font-family: var(--font-family-label);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-left: var(--space-1);
}

.app-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.app-input__icon {
  position: absolute;
  color: var(--color-outline);
  pointer-events: none;
}

.app-input__icon--left {
  left: var(--space-4);
}

.app-input__icon--right {
  right: var(--space-4);
}

.app-input__icon-btn {
  position: absolute;
  right: var(--space-4);
  background: transparent;
  border: none;
  color: var(--color-outline);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.app-input__icon-btn:hover {
  color: var(--color-text-primary);
}

.app-input__field {
  width: 100%;
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background-color: var(--color-surface-container-high);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
  outline: none;
}

.app-input__field::placeholder {
  color: var(--color-outline-variant);
}

.app-input__field:focus {
  background-color: var(--color-surface-container-lowest);
  box-shadow: 0 0 0 2px var(--color-primary-fixed-dim); /* Aproximación a surface-tint */
}

.app-input__field--has-icon-left {
  padding-left: var(--space-12);
}

.app-input__field--has-icon-right {
  padding-right: var(--space-12);
}

.app-input--error .app-input__field {
  box-shadow: 0 0 0 2px var(--color-error);
}

.app-input__error-msg {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-left: var(--space-1);
}

.app-input--disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>