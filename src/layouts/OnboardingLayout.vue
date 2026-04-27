<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import OnboardingSidebar, { type OnboardingStep } from '@/components/onboarding/OnboardingSidebar.vue'
import TopAppBar from '@/components/onboarding/TopAppBar.vue'
import OnboardingFooter from '@/components/onboarding/OnboardingFooter.vue'

const router = useRouter()
const route = useRoute()
const store = useOnboardingStore()

const isCliente = computed(() => store.role === 'cliente')

const steps: OnboardingStep[] = [
  { id: 1, title: 'Identity', icon: 'person', path: 'identity' },
  { id: 2, title: 'Business', icon: 'domain', path: 'business' },
  { id: 3, title: 'Schedule', icon: 'calendar_today', path: 'schedule' },
  { id: 4, title: 'Finalize', icon: 'verified', path: 'finalize' }
]

const currentStepIndex = computed(() => {
  const currentPath = route.path.split('/').pop()
  const index = steps.findIndex(s => s.path === currentPath)
  return index >= 0 ? index : 0
})

const currentStep = computed(() => steps[currentStepIndex.value]?.id)

const showBack = computed(() => currentStepIndex.value > 0)
const isFinalStep = computed(() => currentStepIndex.value === steps.length - 1)

const continueText = computed(() => {
  if (isCliente.value) return 'Registrarse'
  if (isFinalStep.value) return 'Ir al Panel de Control'
  return 'Continuar'
})

function handleBack() {
  if (currentStepIndex.value > 0) {
    router.push(`/register/onboarding/${steps[currentStepIndex.value - 1]?.path}`)
  }
}

function handleContinue() {
  if (isCliente.value) {
    // Redirigir al dashboard de cliente o ruta principal
    router.push('/')
  } else if (currentStepIndex.value < steps.length - 1) {
    router.push(`/register/onboarding/${steps[currentStepIndex.value + 1]?.path}`)
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="onboarding-layout">
    <OnboardingSidebar 
      v-if="!isCliente"
      :steps="steps" 
      :currentStep="currentStep ?? 0" 
    />
    
    <main class="onboarding-layout__main" :class="{ 'onboarding-layout__main--full': isCliente }">
      <TopAppBar class="onboarding-layout__topbar" />
      
      <div class="onboarding-layout__content-wrapper">
        <div class="onboarding-layout__content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>

      <OnboardingFooter 
        class="onboarding-layout__footer"
        :showBack="showBack"
        :continueText="continueText"
        :isFinalStep="isFinalStep"
        @back="handleBack"
        @continue="handleContinue"
      />
    </main>
  </div>
</template>

<style scoped>
.onboarding-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-surface);
}

.onboarding-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 0;
  position: relative;
}

@media (min-width: 1024px) {
  .onboarding-layout__main {
    margin-left: 24rem; /* match sidebar width */
  }
}

.onboarding-layout__main--full {
  margin-left: 0 !important;
}

.onboarding-layout__topbar {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 40;
}

.onboarding-layout__content-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: var(--space-8);
  padding-top: calc(var(--space-16) + var(--space-8)); /* space for topbar */
  overflow-y: auto;
}

@media (min-width: 768px) {
  .onboarding-layout__content-wrapper {
    padding: var(--space-12) var(--space-16);
    padding-top: calc(var(--space-16) + var(--space-12));
  }
}

.onboarding-layout__content {
  width: 100%;
  max-width: 56rem; /* max-w-4xl */
  display: flex;
  align-items: center;
  justify-content: center;
}

.onboarding-layout__footer {
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>