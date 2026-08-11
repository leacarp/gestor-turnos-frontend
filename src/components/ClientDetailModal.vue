<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import AppButton from '@/components/AppButton.vue'
import type { Client } from '@/components/ClientCard.vue'
import { fechaCorta, oGuion } from '@/utils/clientDisplay'
import { getInitials } from '@/utils/initials'

const props = defineProps<{ client: Client }>()

const emit = defineEmits<{ close: [] }>()

const esRegistrado = computed(() => props.client.tipo === 'REGISTRADO')

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

const fechaLarga = (iso: string | null): string => {
  if (!iso) return 'Sin turnos registrados'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <Teleport to="body">
    <div
      class="client-detail__backdrop"
      role="presentation"
      @click.self="emit('close')"
    >
      <div
        class="client-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-detail-title"
      >
        <button
          type="button"
          class="client-detail__close"
          aria-label="Cerrar"
          @click="emit('close')"
        >
          <span class="material-symbols-outlined" aria-hidden="true">close</span>
        </button>

        <!-- Identidad -->
        <header class="client-detail__header">
          <div class="client-detail__avatar" aria-hidden="true">
            {{ getInitials(client.name) }}
          </div>
          <div class="client-detail__identity">
            <h2 id="client-detail-title" class="client-detail__name">
              {{ oGuion(client.name) }}
            </h2>
            <span
              class="client-detail__badge"
              :class="esRegistrado ? 'client-detail__badge--registrado' : 'client-detail__badge--invitado'"
            >
              {{ esRegistrado ? 'Cliente registrado' : 'Reservó como invitado' }}
            </span>
          </div>
        </header>

        <!-- Contacto -->
        <section class="client-detail__section">
          <h3 class="client-detail__section-title">Contacto</h3>
          <dl class="client-detail__list">
            <div class="client-detail__row">
              <dt class="client-detail__label">
                <span class="material-symbols-outlined" aria-hidden="true">mail</span>
                Email
              </dt>
              <dd class="client-detail__value">{{ oGuion(client.email) }}</dd>
            </div>
            <div class="client-detail__row">
              <dt class="client-detail__label">
                <span class="material-symbols-outlined" aria-hidden="true">call</span>
                Teléfono
              </dt>
              <dd class="client-detail__value">{{ oGuion(client.phone) }}</dd>
            </div>
          </dl>
        </section>

        <!-- Métricas -->
        <section class="client-detail__section">
          <h3 class="client-detail__section-title">Actividad</h3>
          <div class="client-detail__metrics">
            <div class="client-detail__metric">
              <span class="client-detail__metric-value">{{ client.turnosCount }}</span>
              <span class="client-detail__metric-label">
                {{ client.turnosCount === 1 ? 'turno' : 'turnos' }} en total
              </span>
            </div>
            <div class="client-detail__metric">
              <span class="client-detail__metric-value client-detail__metric-value--date">
                {{ fechaCorta(client.ultimoTurno) }}
              </span>
              <span class="client-detail__metric-label">último turno</span>
            </div>
          </div>
          <p class="client-detail__metric-note">{{ fechaLarga(client.ultimoTurno) }}</p>
        </section>

        <footer class="client-detail__actions">
          <AppButton variant="outline" @click="emit('close')">Cerrar</AppButton>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.client-detail__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(25, 27, 35, 0.45);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.client-detail {
  position: relative;
  width: 100%;
  max-width: 28rem;
  /* 100vh en Safari iOS mide la ventana con la barra de direcciones
   * retraída, así que el modal quedaba más alto que lo visible. dvh sigue
   * el viewport real; el vh queda de fallback para navegadores viejos. */
  max-height: calc(100vh - var(--space-8));
  max-height: calc(100dvh - var(--space-8));
  overflow-y: auto;
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-surface-container);
  font-family: var(--font-family-base);
}

.client-detail__close {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  border: none;
  background: transparent;
  border-radius: var(--radius-full);
  padding: var(--space-1);
  cursor: pointer;
  color: var(--color-on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: var(--tap-target-min);
  min-height: var(--tap-target-min);
  transition: background-color var(--transition-fast);
}

.client-detail__close:hover {
  background-color: var(--color-surface-container-low);
}

/* ── Identidad ────────────────────────────────────────── */
.client-detail__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-right: var(--space-8);
  margin-bottom: var(--space-8);
}

.client-detail__avatar {
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-fixed);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.client-detail__identity {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.client-detail__name {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  overflow-wrap: anywhere;
}

.client-detail__badge {
  align-self: flex-start;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  line-height: 1.5;
}

.client-detail__badge--registrado {
  background-color: var(--color-primary-fixed);
  color: var(--color-primary);
}

.client-detail__badge--invitado {
  background-color: var(--color-surface-container-high);
  color: var(--color-on-surface-variant);
}

/* ── Secciones ────────────────────────────────────────── */
.client-detail__section {
  margin-bottom: var(--space-6);
}

.client-detail__section-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-on-surface-variant);
  margin: 0 0 var(--space-3);
}

.client-detail__list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.client-detail__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
}

.client-detail__label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.client-detail__label .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-primary);
  opacity: 0.8;
}

.client-detail__value {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  text-align: right;
  overflow-wrap: anywhere;
}

/* ── Métricas ─────────────────────────────────────────── */
.client-detail__metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.client-detail__metric {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4);
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-lg);
}

.client-detail__metric-value {
  font-family: var(--font-family-headline);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  line-height: 1.1;
}

.client-detail__metric-value--date {
  font-size: var(--font-size-lg);
}

.client-detail__metric-label {
  font-size: var(--font-size-xs);
  color: var(--color-on-surface-variant);
}

.client-detail__metric-note {
  margin: var(--space-3) 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-on-surface-variant);
}

/* ── Acciones ─────────────────────────────────────────── */
.client-detail__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  /* En celular los botones ocupan el ancho completo, apilados; desde 480px
   * vuelven a alinearse a la derecha. */
  flex-direction: column;
}

.client-detail__actions > * {
  width: 100%;
}

@media (min-width: 480px) {
  .client-detail__actions {
    flex-direction: row;
    justify-content: flex-end;
  }

  .client-detail__actions > * {
    width: auto;
  }
}

@media (min-width: 768px) {
  .client-detail {
    padding: var(--space-8);
  }
}

.client-detail__actions:empty {
  display: none;
}
</style>
