<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { availabilityService } from '@/services/availabilityService'
import OnboardingSidebar, { type OnboardingStep } from '@/components/onboarding/OnboardingSidebar.vue'
import OnboardingFooter from '@/components/onboarding/OnboardingFooter.vue'
import { isValidPhone } from '@/utils/phone'

const router = useRouter()
const route = useRoute()
const store = useOnboardingStore()
const authStore = useAuthStore()

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

const isClient = computed(() => store.role === 'client')

const steps: OnboardingStep[] = [
  { id: 1, title: 'Identidad', icon: 'person', path: 'identity' },
  { id: 2, title: 'Negocio', icon: 'domain', path: 'business' },
  { id: 3, title: 'Horarios', icon: 'calendar_today', path: 'schedule' },
  { id: 4, title: 'Finalizar', icon: 'verified', path: 'finalize' },
]

const currentStepIndex = computed(() => {
  const currentPath = route.path.split('/').pop()
  const index = steps.findIndex((s) => s.path === currentPath)
  return index >= 0 ? index : 0
})

const currentStep = computed(() => steps[currentStepIndex.value]?.id)

const showBack = computed(() => currentStepIndex.value > 0)
const isFinalStep = computed(() => currentStepIndex.value === steps.length - 1)

const continueText = computed(() => {
  if (isClient.value) return 'Registrarse'
  if (isFinalStep.value) return 'Ir al Panel de Control'
  return 'Continuar'
})

const isLoading = computed(() => isSubmitting.value || authStore.isLoading)

function validateIdentity(): boolean {
  const { name, email, phone, password } = store.getIdentityData()

  if (!name.trim()) {
    submitError.value = 'Ingresá tu nombre completo.'
    return false
  }
  if (!email.trim()) {
    submitError.value = 'Ingresá tu email.'
    return false
  }
  if (!phone.trim()) {
    submitError.value = 'Ingresá tu teléfono.'
    return false
  }
  if (!isValidPhone(phone)) {
    submitError.value =
      'El teléfono debe tener al menos 11 dígitos (ej: 5491112345678, con código de país y área).'
    return false
  }
  if (!password) {
    submitError.value = 'Ingresá tu contraseña (volvé al paso Identidad si no la ves).'
    return false
  }
  if (password.length < 6) {
    submitError.value = 'La contraseña debe tener al menos 6 caracteres.'
    return false
  }
  return true
}

function validateProviderBusiness(): boolean {
  const { publicInfo, serviceType, address } = store.business
  if (!publicInfo.trim() || !serviceType || !address.trim()) {
    submitError.value = 'Completá nombre del negocio, categoría y dirección.'
    return false
  }
  if (publicInfo.trim().length < 4) {
    submitError.value = 'El nombre del negocio debe tener al menos 4 caracteres.'
    return false
  }

  const advanceError = store.validateAdvance()
  if (advanceError) {
    submitError.value = advanceError
    return false
  }
  return true
}

function validateSchedule(): boolean {
  const hasActiveDay = store.schedule.some((day) => day.isActive)
  if (!hasActiveDay) {
    submitError.value = 'Activá al menos un día con horario disponible.'
    return false
  }
  return true
}

async function registerClient() {
  if (!validateIdentity()) return
  store.saveIdentitySnapshot()
  submitError.value = null
  isSubmitting.value = true
  try {
    await authStore.register(store.buildRegisterDto())
    await router.push({ name: 'home' })
  } catch {
    submitError.value = authStore.error
  } finally {
    isSubmitting.value = false
  }
}

async function registerProviderAndSchedule() {
  if (!validateIdentity() || !validateProviderBusiness() || !validateSchedule()) return
  submitError.value = null
  isSubmitting.value = true
  try {
    await authStore.register(store.buildRegisterDto())
    await availabilityService.createSchedule({
      slots: store.buildWeeklyScheduleSlots(),
    })
    await router.push(`/register/onboarding/${steps[currentStepIndex.value + 1]?.path}`)
  } catch {
    submitError.value = authStore.error
  } finally {
    isSubmitting.value = false
  }
}

function handleBack() {
  submitError.value = null
  if (currentStepIndex.value > 0) {
    router.push(`/register/onboarding/${steps[currentStepIndex.value - 1]?.path}`)
  }
}

async function handleContinue() {
  submitError.value = null

  if (isClient.value) {
    await registerClient()
    return
  }

  const path = route.path.split('/').pop()

  if (path === 'identity') {
    if (!validateIdentity()) return
    store.saveIdentitySnapshot()
    router.push('/register/onboarding/business')
    return
  }

  if (path === 'business') {
    if (!validateIdentity() || !validateProviderBusiness()) return
    store.saveIdentitySnapshot()
    router.push('/register/onboarding/schedule')
    return
  }

  if (path === 'schedule') {
    await registerProviderAndSchedule()
    return
  }

  if (isFinalStep.value) {
    await router.push({ name: 'home' })
  }
}
</script>

<template>
  <div class="onboarding-layout">
    <OnboardingSidebar v-if="!isClient" :steps="steps" :currentStep="currentStep ?? 0" />

    <main class="onboarding-layout__main" :class="{ 'onboarding-layout__main--full': isClient }">

      <div class="onboarding-layout__content-wrapper">
        <div class="onboarding-layout__content">
          <p v-if="submitError || authStore.error" class="onboarding-layout__error">
            {{ submitError || authStore.error }}
          </p>

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
        :isLoading="isLoading"
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
    margin-left: 24rem;
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
  padding-top: calc(var(--space-16) + var(--space-8));
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
  max-width: 56rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
}

.onboarding-layout__error {
  width: 100%;
  max-width: 28rem;
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  background-color: rgba(186, 26, 26, 0.08);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  text-align: center;
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
