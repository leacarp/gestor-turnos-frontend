<script setup lang="ts">
import type { BookingService } from '@/stores/useAppointmentBookingStore'

const props = defineProps<{
  service: BookingService
}>()

const emit = defineEmits<{
  select: [service: BookingService]
}>()

function handleSelect() {
  emit('select', props.service)
}
</script>

<template>
  <article 
    class="service-card group" 
    @click="handleSelect"
    tabindex="0"
    role="button"
    @keydown.enter="handleSelect"
    @keydown.space.prevent="handleSelect"
  >
    <div class="service-card__header">
      <h3 class="service-card__title">{{ service.name }}</h3>
      <span v-if="service.isPopular" class="service-card__badge">Popular</span>
    </div>
    
    <p class="service-card__description">{{ service.description }}</p>
    
    <div class="service-card__footer">
      <div class="service-card__details">
        <div class="service-card__duration">
          <span class="material-symbols-outlined service-card__duration-icon">schedule</span>
          {{ service.duration }} min
        </div>
        <div class="service-card__price">
          ${{ service.price }}
        </div>
      </div>
      
      <button 
        class="service-card__action"
        :class="{ 'service-card__action--primary': service.isPopular, 'service-card__action--secondary': !service.isPopular }"
        type="button"
        aria-label="Seleccionar servicio"
        tabindex="-1"
      >
        <span class="material-symbols-outlined">add</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.service-card {
  position: relative;
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  transition: all var(--transition-base);
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  outline: none;
}

.service-card:hover,
.service-card:focus-visible {
  box-shadow: var(--shadow-primary-soft);
  border-color: rgba(0, 50, 86, 0.1); /* hover:border-primary/10 */
}

.service-card:focus-visible {
  ring: 2px solid var(--color-primary);
  ring-offset: 2px;
}

.service-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
  gap: var(--space-2);
}

.service-card__title {
  font-family: var(--font-family-headline);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  line-height: var(--line-height-tight);
}

.service-card__badge {
  background-color: rgba(0, 50, 86, 0.05); /* bg-primary/5 */
  color: var(--color-primary);
  font-size: 10px; /* text-[10px] */
  padding: 2px 8px; /* px-2 py-0.5 */
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  flex-shrink: 0;
}

.service-card__description {
  color: var(--color-text-secondary); /* text-on-surface-variant */
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-8);
  line-height: var(--line-height-loose); /* leading-relaxed */
  flex-grow: 1;
}

.service-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-surface-container-high);
}

.service-card__details {
  display: flex;
  flex-direction: column;
  gap: var(--space-1); /* space-y-1 */
}

.service-card__duration {
  display: flex;
  align-items: center;
  gap: var(--space-1-5); /* gap-1.5 */
  color: rgba(64, 72, 76, 0.7); /* text-on-surface-variant/70 */
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.service-card__duration-icon {
  font-size: 16px;
}

.service-card__price {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-2xl);
  font-weight: 800; /* extrabold */
  color: var(--color-primary);
  line-height: var(--line-height-tight);
}

.service-card__action {
  padding: var(--space-3);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  outline: none;
}

.service-card__action--primary {
  background-color: var(--color-primary);
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 50, 86, 0.2), 0 4px 6px -4px rgba(0, 50, 86, 0.2); /* shadow-lg shadow-primary/20 */
  transition: transform var(--transition-base);
}

.group:hover .service-card__action--primary,
.service-card:focus-visible .service-card__action--primary {
  transform: scale(1.1); /* group-hover:scale-110 */
}

.service-card__action--secondary {
  background-color: var(--color-surface-container-high);
  color: var(--color-primary);
  transition: all var(--transition-base);
}

.group:hover .service-card__action--secondary,
.service-card:focus-visible .service-card__action--secondary {
  background-color: var(--color-primary);
  color: #ffffff;
}
</style>
