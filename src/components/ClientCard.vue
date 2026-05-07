<script setup lang="ts">
export interface Client {
  id: number
  name: string
  email: string
  phone: string
  appointmentsCount: number
}

defineProps<{
  client: Client
}>()
</script>

<template>
  <article class="client-card">
    <div class="client-card__content">
      <h3 class="client-card__name">{{ client.name }}</h3>
      
      <div class="client-card__contact">
        <div class="client-card__contact-item">
          <span class="material-symbols-outlined client-card__icon" aria-hidden="true">mail</span>
          <span class="client-card__text">{{ client.email }}</span>
        </div>
        <div class="client-card__contact-item">
          <span class="material-symbols-outlined client-card__icon" aria-hidden="true">call</span>
          <span class="client-card__text">{{ client.phone }}</span>
        </div>
      </div>

      <div class="client-card__footer">
        <span class="client-card__appointments">
          {{ client.appointmentsCount }} turnos realizados
        </span>
      </div>
    </div>
    
    <div class="client-card__hover-bar"></div>
  </article>
</template>

<style scoped>
.client-card {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-slow);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  border: 1px solid transparent;
}

.client-card:hover {
  box-shadow: 0 40px 40px -10px rgba(81, 95, 119, 0.06);
  transform: translateY(-2px);
}

.client-card__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.client-card__name {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4) 0;
  transition: color var(--transition-fast);
}

.client-card:hover .client-card__name {
  color: var(--color-primary);
}

.client-card__contact {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  flex: 1;
}

.client-card__contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.client-card__icon {
  font-size: 20px;
  color: var(--color-primary);
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}

.client-card:hover .client-card__icon {
  opacity: 1;
}

.client-card__text {
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.client-card__footer {
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-surface-container-high);
}

.client-card__appointments {
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-container);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.client-card__appointments::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
}

.client-card__hover-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--color-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 500ms ease;
}

.client-card:hover .client-card__hover-bar {
  transform: scaleX(1);
}
</style>
