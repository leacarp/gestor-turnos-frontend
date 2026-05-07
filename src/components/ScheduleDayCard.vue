<script setup lang="ts">
import type { TimeRange } from '@/stores/useOnboardingStore'

const props = defineProps<{
  dayName: string
  isActive: boolean
  timeRanges: TimeRange[]
}>()

const emit = defineEmits<{
  'update:isActive': [value: boolean]
  'update:timeRanges': [value: TimeRange[]]
}>()

function toggleActive(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:isActive', target.checked)
}

function updateTimeRange(index: number, field: 'start' | 'end', value: string) {
  const newRanges = [...props.timeRanges]
  const prev = newRanges[index]
  if (!prev) return
  newRanges[index] = {
    start: field === 'start' ? value : prev.start,
    end: field === 'end' ? value : prev.end,
  }
  emit('update:timeRanges', newRanges)
}

function addTimeRange() {
  const newRanges = [...props.timeRanges, { start: '09:00', end: '18:00' }]
  emit('update:timeRanges', newRanges)
}
</script>

<template>
  <div 
    class="schedule-day-card" 
    :class="{ 'schedule-day-card--inactive': !isActive }"
  >
    <div class="schedule-day-card__header">
      <label class="schedule-day-card__toggle">
        <input 
          type="checkbox" 
          :checked="isActive" 
          @change="toggleActive"
          class="schedule-day-card__checkbox sr-only"
        />
        <div class="schedule-day-card__switch"></div>
      </label>
      <span class="schedule-day-card__day">{{ dayName }}</span>
    </div>

    <div v-if="isActive" class="schedule-day-card__ranges">
      <div v-for="(range, index) in timeRanges" :key="index" class="schedule-day-card__range">
        <div class="schedule-day-card__time-input">
          <span class="schedule-day-card__time-label">Desde</span>
          <input 
            type="time" 
            :value="range.start"
            @input="e => updateTimeRange(index, 'start', (e.target as HTMLInputElement).value)"
            class="schedule-day-card__time-field"
          />
        </div>
        
        <span class="schedule-day-card__time-separator">a</span>
        
        <div class="schedule-day-card__time-input">
          <span class="schedule-day-card__time-label">Hasta</span>
          <input 
            type="time" 
            :value="range.end"
            @input="e => updateTimeRange(index, 'end', (e.target as HTMLInputElement).value)"
            class="schedule-day-card__time-field"
          />
        </div>
        
        <button 
          v-if="index === timeRanges.length - 1"
          type="button" 
          class="schedule-day-card__add-btn" 
          @click="addTimeRange"
        >
          <span class="material-symbols-outlined">add_circle</span>
        </button>
      </div>
    </div>
    
    <div v-else class="schedule-day-card__closed">
      <span class="schedule-day-card__closed-text">Cerrado</span>
    </div>
  </div>
</template>

<style scoped>
.schedule-day-card {
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  transition: background-color var(--transition-base);
}

.schedule-day-card:hover {
  background-color: var(--color-surface-container);
}

.schedule-day-card--inactive {
  background-color: rgba(243, 244, 245, 0.5); /* var(--color-surface-container-low) opacity 50% */
  opacity: 0.6;
}

@media (min-width: 768px) {
  .schedule-day-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.schedule-day-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  min-width: 200px;
}

.schedule-day-card__toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.schedule-day-card__switch {
  width: 3.5rem;
  height: 1.75rem;
  background-color: var(--color-surface-container-highest);
  border-radius: var(--radius-full);
  position: relative;
  transition: background-color var(--transition-fast);
}

.schedule-day-card__switch::after {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.25rem;
  background-color: #fff;
  border-radius: var(--radius-full);
  height: 1.5rem;
  width: 1.5rem;
  transition: transform var(--transition-fast);
}

.schedule-day-card__checkbox:checked ~ .schedule-day-card__switch {
  background-color: var(--color-primary-container);
}

.schedule-day-card__checkbox:checked ~ .schedule-day-card__switch::after {
  transform: translateX(100%);
}

.schedule-day-card__day {
  font-family: var(--font-family-headline);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  min-width: 100px;
}

.schedule-day-card__ranges {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.schedule-day-card__range {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.schedule-day-card__time-input {
  display: flex;
  flex-direction: column;
}

.schedule-day-card__time-label {
  font-size: var(--font-size-sm);
  font-family: var(--font-family-label);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-outline);
  margin-bottom: var(--space-1);
}

.schedule-day-card__time-field {
  background-color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow-sm);
  outline: none;
}

.schedule-day-card__time-field:focus {
  box-shadow: 0 0 0 2px rgba(0, 50, 86, 0.2);
}

.schedule-day-card__time-separator {
  margin-top: var(--space-6);
  font-weight: var(--font-weight-bold);
  color: var(--color-outline);
}

.schedule-day-card__add-btn {
  margin-top: var(--space-6);
  padding: var(--space-2);
  color: var(--color-outline);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.schedule-day-card__add-btn:hover {
  color: var(--color-primary);
}

.schedule-day-card__closed {
  display: flex;
  align-items: center;
  height: 58px;
}

.schedule-day-card__closed-text {
  font-style: italic;
  color: var(--color-outline);
}
</style>