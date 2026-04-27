<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'

defineProps<{
  showBack?: boolean
  continueText?: string
  isFinalStep?: boolean
}>()

const emit = defineEmits<{
  back: []
  continue: []
}>()
</script>

<template>
  <footer class="onboarding-footer" :class="{ 'onboarding-footer--final': isFinalStep }">
    <button 
      v-if="showBack" 
      type="button" 
      class="onboarding-footer__back-btn" 
      @click="emit('back')"
    >
      <span class="material-symbols-outlined">arrow_back</span>
      Volver
    </button>
    
    <div v-else></div>

    <AppButton 
      variant="gradient" 
      size="lg" 
      class="onboarding-footer__continue-btn"
      :iconRight="!isFinalStep ? '' : 'arrow_forward'"
      @click="emit('continue')"
    >
      {{ continueText || 'Continuar' }}
    </AppButton>
  </footer>
</template>

<style scoped>
.onboarding-footer {
  margin-top: auto;
  border-top: 1px solid var(--color-surface-container);
  padding: var(--space-8) var(--space-16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  background-color: var(--color-surface);
  z-index: 40;
}

.onboarding-footer--final {
  background-color: var(--color-surface);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.03);
  border-top: none;
}

@media (max-width: 768px) {
  .onboarding-footer {
    flex-direction: column;
    padding: var(--space-6) var(--space-8);
  }
  .onboarding-footer__continue-btn {
    width: 100%;
  }
}

.onboarding-footer__back-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-secondary);
  font-weight: var(--font-weight-semibold);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--transition-fast);
  padding: 0;
}

.onboarding-footer__back-btn:hover {
  color: var(--color-primary);
  gap: var(--space-3);
}

.onboarding-footer__continue-btn {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  padding-left: var(--space-10);
  padding-right: var(--space-10);
}
</style>