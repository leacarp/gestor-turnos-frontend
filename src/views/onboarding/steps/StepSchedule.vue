<script setup lang="ts">
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import ScheduleDayCard from '@/components/ScheduleDayCard.vue'

const store = useOnboardingStore()
</script>

<template>
  <div class="step-schedule">
    <div class="step-schedule__header">
      <h2 class="step-schedule__title">Define tu horario</h2>
      <p class="step-schedule__subtitle">
        Selecciona los días y rangos horarios en los que ofreces tus servicios. Esto permitirá a tus clientes reservar citas de forma automática.
      </p>
    </div>

    <div class="step-schedule__list">
      <ScheduleDayCard
        v-for="day in store.schedule"
        :key="day.id"
        :dayName="day.dayName"
        v-model:isActive="day.isActive"
        v-model:timeRanges="day.timeRanges"
      />
    </div>

    <div class="step-schedule__bento">
      <div class="step-schedule__bento-sync">
        <div class="step-schedule__bento-content">
          <p class="step-schedule__bento-title">Sincronización Inteligente</p>
          <p class="step-schedule__bento-desc">Próximamente podrás conectar Google Calendar y Outlook para evitar solapamientos automáticamente.</p>
        </div>
        <div class="step-schedule__bento-icon">
          <span class="material-symbols-outlined">sync</span>
        </div>
      </div>
      
      <div class="step-schedule__bento-grace">
        <span class="material-symbols-outlined step-schedule__bento-grace-icon">lock_clock</span>
        <p class="step-schedule__bento-grace-title">Tiempos de Gracia</p>
        <p class="step-schedule__bento-grace-desc">Configura 15 min entre citas en el próximo paso.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-schedule {
  width: 100%;
}

.step-schedule__header {
  margin-bottom: var(--space-12);
}

.step-schedule__title {
  font-size: var(--font-size-3xl);
  font-family: var(--font-family-headline);
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: -0.025em;
  margin-bottom: var(--space-3);
  line-height: var(--line-height-tight);
}

.step-schedule__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 42rem;
  line-height: var(--line-height-loose);
}

.step-schedule__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.step-schedule__bento {
  margin-top: var(--space-12);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .step-schedule__bento {
    grid-template-columns: repeat(3, 1fr);
  }
}

.step-schedule__bento-sync {
  grid-column: 1 / -1;
  background-color: var(--color-primary-fixed);
  padding: var(--space-8);
  border-radius: var(--radius-3xl);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 200px;
}

@media (min-width: 768px) {
  .step-schedule__bento-sync {
    grid-column: span 2;
  }
}

.step-schedule__bento-content {
  position: relative;
  z-index: 10;
}

.step-schedule__bento-title {
  color: var(--color-primary-container);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-2);
}

.step-schedule__bento-desc {
  color: var(--color-primary-container);
  opacity: 0.7;
  font-size: var(--font-size-sm);
  max-width: 24rem;
}

.step-schedule__bento-icon {
  position: absolute;
  top: -2.5rem;
  right: -2.5rem;
  opacity: 0.1;
}

.step-schedule__bento-icon .material-symbols-outlined {
  font-size: 160px;
}

.step-schedule__bento-grace {
  background-color: var(--color-surface-container-high);
  padding: var(--space-8);
  border-radius: var(--radius-3xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.step-schedule__bento-grace-icon {
  color: var(--color-primary);
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-3);
}

.step-schedule__bento-grace-title {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.step-schedule__bento-grace-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}
</style>