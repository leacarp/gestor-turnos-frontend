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
  </article>
</template>

<style scoped>
.client-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}

.client-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.client-card__name {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.client-card__contact {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.client-card__contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.client-card__icon {
  font-size: 20px;
  color: var(--color-outline);
}

.client-card__text {
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.client-card__footer {
  margin-top: var(--space-2);
}

.client-card__appointments {
  font-family: var(--font-family-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-success);
}
</style>
