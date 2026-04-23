<script setup lang="ts">
export interface OnboardingStep {
  id: number
  title: string
  icon: string
  path: string
}

const props = defineProps<{
  steps: OnboardingStep[]
  currentStep: number
}>()
</script>

<template>
  <aside class="onboarding-sidebar">
    <div class="onboarding-sidebar__brand">
      <span class="onboarding-sidebar__logo">TurnoPro</span>
      <span class="onboarding-sidebar__subtitle">Provider Onboarding</span>
    </div>

    <nav class="onboarding-sidebar__nav">
      <div
        v-for="step in steps"
        :key="step.id"
        class="onboarding-sidebar__step"
        :class="{
          'onboarding-sidebar__step--active': currentStep === step.id,
          'onboarding-sidebar__step--completed': currentStep > step.id
        }"
      >
        <span 
          class="material-symbols-outlined onboarding-sidebar__step-icon"
          :class="{ 'onboarding-sidebar__step-icon--filled': currentStep >= step.id }"
        >
          {{ step.icon }}
        </span>
        <span class="onboarding-sidebar__step-title">{{ step.title }}</span>
        <span 
          v-if="currentStep > step.id" 
          class="material-symbols-outlined onboarding-sidebar__step-check"
        >
          check_circle
        </span>
      </div>

      <div class="onboarding-sidebar__progress">
        <div class="onboarding-sidebar__progress-card">
          <div class="onboarding-sidebar__progress-header">
            <div class="onboarding-sidebar__progress-dot"></div>
            <span class="onboarding-sidebar__progress-text">Paso {{ currentStep }} de {{ steps.length }}</span>
          </div>
          <div class="onboarding-sidebar__progress-bar">
            <div 
              class="onboarding-sidebar__progress-fill" 
              :style="{ width: `${(currentStep / steps.length) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </nav>

    <div class="onboarding-sidebar__decor">
      <img 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPCGzvlrJqhMdvrcte_Dy_-kyauOc9InLhWqtF4ru8ocSXwIsBKf3QTcS9e2qkIs22XUQnpav1CpiJQHL2Kib2XogT6m26PrtHlFT2Uoc2TdPESchr7m9hPLk5lCaQRUXifZULL9QHgn2zkPoThRWYfbnRJltvRtvVdnLSAdx3FQ7J1Ykmi0fEhYwx2LYg_MQqPEGaJfz1L9FLbWoU7CJxee8QnWwU5zNSTpuV-V7OlhEackKEspMuS3rVl-amb_oMeVNLaMgW-srz" 
        class="onboarding-sidebar__decor-img" 
        alt="" 
        aria-hidden="true"
      />
      <div class="onboarding-sidebar__decor-overlay"></div>
    </div>
  </aside>
</template>

<style scoped>
.onboarding-sidebar {
  display: none;
  flex-direction: column;
  height: 100vh;
  width: 20rem;
  position: fixed;
  left: 0;
  top: 0;
  background-color: var(--color-primary);
  color: #fff;
  padding: var(--space-12) var(--space-6);
  z-index: 50;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

@media (min-width: 1024px) {
  .onboarding-sidebar {
    display: flex;
    width: 24rem;
    padding: var(--space-12) var(--space-10);
  }
}

.onboarding-sidebar__brand {
  margin-bottom: var(--space-12);
}

.onboarding-sidebar__logo {
  font-size: var(--font-size-3xl);
  font-family: var(--font-family-headline);
  font-weight: 800;
  letter-spacing: -0.025em;
  display: block;
}

.onboarding-sidebar__subtitle {
  color: var(--color-primary-container);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  opacity: 0.8;
  display: block;
  margin-top: var(--space-1);
}

.onboarding-sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.onboarding-sidebar__step {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  color: rgba(255, 255, 255, 0.6);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast), transform var(--transition-fast);
}

.onboarding-sidebar__step--completed {
  color: rgba(255, 255, 255, 0.6);
}

.onboarding-sidebar__step--completed:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.onboarding-sidebar__step--active {
  color: #fff;
  font-weight: var(--font-weight-bold);
  background-color: rgba(255, 255, 255, 0.1);
}

.onboarding-sidebar__step-icon {
  color: var(--color-primary-fixed-dim);
}

.onboarding-sidebar__step-icon--filled {
  font-variation-settings: 'FILL' 1;
}

.onboarding-sidebar__step-title {
  font-family: var(--font-family-headline);
}

.onboarding-sidebar__step-check {
  margin-left: auto;
  font-size: var(--font-size-sm);
  color: var(--color-primary-fixed-dim);
}

.onboarding-sidebar__progress {
  margin-top: auto;
}

.onboarding-sidebar__progress-card {
  padding: var(--space-5);
  border-radius: var(--radius-2xl);
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
}

.onboarding-sidebar__progress-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.onboarding-sidebar__progress-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-fixed-dim);
}

.onboarding-sidebar__progress-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.onboarding-sidebar__progress-bar {
  width: 100%;
  height: 0.375rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.onboarding-sidebar__progress-fill {
  height: 100%;
  background-color: var(--color-primary-fixed-dim);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.onboarding-sidebar__decor {
  margin-top: var(--space-6);
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  height: 8rem;
  width: 100%;
}

.onboarding-sidebar__decor-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
  mix-blend-mode: overlay;
}

.onboarding-sidebar__decor-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-primary), transparent);
}
</style>