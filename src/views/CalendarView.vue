<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

export type EstadoTurnoAgenda = 'confirmado' | 'pendiente' | 'cancelado'

export interface TurnoAgendaItem {
  id: string
  /** YYYY-MM-DD (local) */
  date: string
  hour: number
  minute: number
  clientName: string
  service: string
  estado: EstadoTurnoAgenda
  bar: 'primary' | 'tertiary'
}

const router = useRouter()

const WEEK_DAYS = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'] as const

const estadoOptions: { value: EstadoTurnoAgenda; label: string }[] = [
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'cancelado', label: 'Cancelado' },
]

function toYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

const todayStart = startOfDay(new Date())
const todayYmd = toYmd(todayStart)

const selectedDate = ref<Date>(new Date(todayStart))
const visibleMonth = ref<Date>(new Date(todayStart))
const searchQuery = ref('')
const cancelAllModalOpen = ref(false)
const cancelAllStep = ref<1 | 2>(1)

function initialTurnos(): TurnoAgendaItem[] {
  return [
    {
      id: '1',
      date: todayYmd,
      hour: 9,
      minute: 0,
      clientName: 'Ricardo Mendoza',
      service: 'Consulta Médica General',
      estado: 'confirmado',
      bar: 'primary',
    },
    {
      id: '2',
      date: todayYmd,
      hour: 10,
      minute: 30,
      clientName: 'Valeria Torres',
      service: 'Control de Resultados',
      estado: 'pendiente',
      bar: 'tertiary',
    },
    {
      id: '3',
      date: todayYmd,
      hour: 11,
      minute: 45,
      clientName: 'Santiago López',
      service: 'Ecografía Abdominal',
      estado: 'confirmado',
      bar: 'primary',
    },
    {
      id: '4',
      date: todayYmd,
      hour: 13,
      minute: 15,
      clientName: 'Mónica Giraldo',
      service: 'Chequeo Preventivo',
      estado: 'confirmado',
      bar: 'primary',
    },
    {
      id: '5',
      date: todayYmd,
      hour: 15,
      minute: 0,
      clientName: 'Carlos Arturo Peña',
      service: 'Traumatología',
      estado: 'pendiente',
      bar: 'tertiary',
    },
    {
      id: '6',
      date: todayYmd,
      hour: 16,
      minute: 30,
      clientName: 'Laura Fernández',
      service: 'Consulta de seguimiento',
      estado: 'cancelado',
      bar: 'tertiary',
    },
  ]
}

const turnos = ref<TurnoAgendaItem[]>(initialTurnos())

const selectedYmd = computed(() => toYmd(selectedDate.value))

const dayTitle = computed(() => {
  const raw = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(selectedDate.value)
  return raw.charAt(0).toUpperCase() + raw.slice(1)
})

const monthTitle = computed(() => {
  const raw = new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth.value)
  return raw.charAt(0).toUpperCase() + raw.slice(1)
})

const turnosForSelectedDay = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return turnos.value
    .filter((t) => t.date === selectedYmd.value)
    .filter(
      (t) =>
        !q ||
        t.clientName.toLowerCase().includes(q) ||
        t.service.toLowerCase().includes(q),
    )
    .slice()
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute))
})

const stats = computed(() => {
  const list = turnos.value.filter((t) => t.date === selectedYmd.value)
  let confirmados = 0
  let pendientes = 0
  let cancelados = 0
  for (const t of list) {
    if (t.estado === 'confirmado') confirmados++
    else if (t.estado === 'pendiente') pendientes++
    else cancelados++
  }
  return { confirmados, pendientes, cancelados, total: list.length }
})

const isSelectedDayToday = computed(() => selectedYmd.value === todayYmd)

const cancelAllFirstMessage = computed(() => {
  if (isSelectedDayToday.value) {
    return '¿Seguro deseas cancelar todos los turnos del dia de hoy? Le avisaremos a todos los clientes afectados.'
  }
  const fecha = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(selectedDate.value)
  return `¿Seguro deseas cancelar todos los turnos del ${fecha}? Le avisaremos a todos los clientes afectados.`
})

const cancelAllSecondMessage = computed(() => {
  if (isSelectedDayToday.value) {
    return 'Esta acción cancelará todos los turnos de hoy. Los clientes serán notificados. ¿Deseas confirmar?'
  }
  return 'Esta acción cancelará todos los turnos de la fecha seleccionada. Los clientes serán notificados. ¿Deseas confirmar?'
})

const nextTurnoId = computed(() => {
  if (!isSelectedDayToday.value) return null
  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()
  for (const t of turnosForSelectedDay.value) {
    const start = t.hour * 60 + t.minute
    if (start >= cur) return t.id
  }
  return null
})

interface CalendarCell {
  date: Date
  inMonth: boolean
}

const calendarCells = computed((): CalendarCell[] => {
  const y = visibleMonth.value.getFullYear()
  const m = visibleMonth.value.getMonth()
  const first = new Date(y, m, 1)
  const startWeekday = (first.getDay() + 6) % 7
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const prevDays = new Date(y, m, 0).getDate()

  const cells: CalendarCell[] = []
  for (let i = 0; i < startWeekday; i++) {
    const day = prevDays - startWeekday + i + 1
    cells.push({ date: new Date(y, m - 1, day), inMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(y, m, d), inMonth: true })
  }
  const rest = (7 - (cells.length % 7)) % 7
  for (let i = 1; i <= rest; i++) {
    cells.push({ date: new Date(y, m + 1, i), inMonth: false })
  }
  return cells
})

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function selectDay(cell: CalendarCell) {
  selectedDate.value = startOfDay(cell.date)
  visibleMonth.value = new Date(cell.date.getFullYear(), cell.date.getMonth(), 1)
}

function prevMonth() {
  const d = visibleMonth.value
  visibleMonth.value = new Date(d.getFullYear(), d.getMonth() - 1, 1)
}

function nextMonth() {
  const d = visibleMonth.value
  visibleMonth.value = new Date(d.getFullYear(), d.getMonth() + 1, 1)
}

function formatHour12(h: number, min: number): { time: string; meridiem: string } {
  const mod = h % 12
  const h12 = mod === 0 ? 12 : mod
  const time = `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')}`
  const meridiem = h < 12 ? 'AM' : 'PM'
  return { time, meridiem }
}

function handleEstadoChange(id: string, ev: Event) {
  const v = (ev.target as HTMLSelectElement).value as EstadoTurnoAgenda
  turnos.value = turnos.value.map((t) => (t.id === id ? { ...t, estado: v } : t))
}

function handleRowActivate(ev: MouseEvent | KeyboardEvent) {
  const el = ev.target as HTMLElement | null
  if (el?.closest?.('.calendar-view__status-select-wrap')) return
  router.push({ name: 'clientes' })
}

function openCancelAllModal() {
  cancelAllStep.value = 1
  cancelAllModalOpen.value = true
}

function closeCancelAllModal() {
  cancelAllModalOpen.value = false
  cancelAllStep.value = 1
}

function advanceCancelAllStep() {
  cancelAllStep.value = 2
}

function confirmCancelAllTurnos() {
  const ymd = selectedYmd.value
  turnos.value = turnos.value.map((t) =>
    t.date === ymd ? { ...t, estado: 'cancelado' as const } : t,
  )
  toast.success('Turnos del día cancelados. Se notificará a los clientes.')
  closeCancelAllModal()
}

</script>

<template>
  <div class="calendar-view">
    <header class="calendar-view__topbar">
      <h2 class="calendar-view__topbar-title">Agenda del Proveedor</h2>
      <div class="calendar-view__topbar-actions">
        <div class="calendar-view__search">
          <span class="material-symbols-outlined calendar-view__search-icon" aria-hidden="true">search</span>
          <input
            v-model="searchQuery"
            class="calendar-view__search-input"
            type="search"
            placeholder="Buscar turnos..."
            aria-label="Buscar turnos"
          />
        </div>
        <div class="calendar-view__topbar-icons">
          <button type="button" class="calendar-view__icon-btn" aria-label="Notificaciones">
            <span class="material-symbols-outlined" aria-hidden="true">notifications</span>
          </button>
          <button type="button" class="calendar-view__icon-btn" aria-label="Historial">
            <span class="material-symbols-outlined" aria-hidden="true">history</span>
          </button>
          <div class="calendar-view__avatar" aria-hidden="true">JD</div>
        </div>
      </div>
    </header>

    <div class="calendar-view__content">
      <div class="calendar-view__page-head">
        <div>
          <p class="calendar-view__kicker">Planificación diaria</p>
          <h3 class="calendar-view__day-title">{{ dayTitle }}</h3>
        </div>
        <button type="button" class="calendar-view__cancel-all" @click="openCancelAllModal">
          <span class="material-symbols-outlined" aria-hidden="true">event_busy</span>
          <span>Cancelar todos</span>
        </button>
      </div>

      <div class="calendar-view__bento">
        <div class="calendar-view__col-left">
          <div class="calendar-view__card calendar-view__card--calendar">
            <div class="calendar-view__cal-head">
              <h4 class="calendar-view__cal-month">{{ monthTitle }}</h4>
              <div class="calendar-view__cal-nav">
                <button type="button" class="calendar-view__cal-nav-btn" aria-label="Mes anterior" @click="prevMonth">
                  <span class="material-symbols-outlined calendar-view__cal-nav-ic" aria-hidden="true">chevron_left</span>
                </button>
                <button type="button" class="calendar-view__cal-nav-btn" aria-label="Mes siguiente" @click="nextMonth">
                  <span class="material-symbols-outlined calendar-view__cal-nav-ic" aria-hidden="true">chevron_right</span>
                </button>
              </div>
            </div>
            <div class="calendar-view__weekdays">
              <span v-for="w in WEEK_DAYS" :key="w" class="calendar-view__weekday">{{ w }}</span>
            </div>
            <div class="calendar-view__grid">
              <button
                v-for="(cell, i) in calendarCells"
                :key="i"
                type="button"
                class="calendar-view__day"
                :class="{
                  'calendar-view__day--outside': !cell.inMonth,
                  'calendar-view__day--selected': isSameDay(cell.date, selectedDate),
                }"
                @click="selectDay(cell)"
              >
                {{ cell.date.getDate() }}
              </button>
            </div>
          </div>

          <router-link class="calendar-view__summary" :to="{ name: 'dashboard' }" aria-label="Ver más estadísticas">
            <div class="calendar-view__summary-inner">
              <p class="calendar-view__summary-label">Resumen del día</p>
              <h4 class="calendar-view__summary-count">{{ stats.total }} Turnos</h4>
              <div class="calendar-view__summary-chips">
                <span class="calendar-view__chip">{{ stats.confirmados }} Confirmados</span>
                <span class="calendar-view__chip">{{ stats.pendientes }} Pendientes</span>
                <span class="calendar-view__chip">{{ stats.cancelados }} Cancelados</span>
              </div>
            </div>
            <div class="calendar-view__summary-deco" aria-hidden="true">
              <span class="material-symbols-outlined calendar-view__summary-deco-icon">calendar_month</span>
            </div>
          </router-link>
        </div>

        <div class="calendar-view__col-right">
          <article
            v-for="t in turnosForSelectedDay"
            :key="t.id"
            class="calendar-view__turn"
            :class="{
              'calendar-view__turn--next': nextTurnoId === t.id,
            }"
            role="button"
            tabindex="0"
            aria-label="Ver clientes"
            @click="handleRowActivate"
            @keydown.enter.prevent="handleRowActivate"
            @keydown.space.prevent="handleRowActivate"
          >
            <div class="calendar-view__turn-main">
              <div class="calendar-view__turn-time">
                <span
                  class="calendar-view__turn-clock"
                  :class="{ 'calendar-view__turn-clock--accent': nextTurnoId === t.id }"
                >{{ formatHour12(t.hour, t.minute).time }}</span>
                <span
                  class="calendar-view__turn-meridiem"
                  :class="{ 'calendar-view__turn-meridiem--accent': nextTurnoId === t.id }"
                >{{ formatHour12(t.hour, t.minute).meridiem }}</span>
              </div>
              <div
                class="calendar-view__turn-rule"
                :class="
                  t.bar === 'primary'
                    ? 'calendar-view__turn-rule--primary'
                    : 'calendar-view__turn-rule--tertiary'
                "
                aria-hidden="true"
              />
              <div class="calendar-view__turn-text">
                <div class="calendar-view__turn-name-row">
                  <h5 class="calendar-view__turn-name">{{ t.clientName }}</h5>
                  <span v-if="nextTurnoId === t.id" class="calendar-view__turn-badge">Siguiente</span>
                </div>
                <p class="calendar-view__turn-service">{{ t.service }}</p>
              </div>
            </div>
            <div class="calendar-view__turn-aside">
              <span
                class="calendar-view__pill"
                :class="{
                  'calendar-view__pill--confirmado': t.estado === 'confirmado',
                  'calendar-view__pill--pendiente': t.estado === 'pendiente',
                  'calendar-view__pill--cancelado': t.estado === 'cancelado',
                }"
              >{{ t.estado }}</span>
              <div class="calendar-view__status-select-wrap" @click.stop @keydown.stop>
                <select
                  :id="`estado-${t.id}`"
                  class="calendar-view__status-select"
                  :value="t.estado"
                  aria-label="Cambiar estado del turno"
                  @change="handleEstadoChange(t.id, $event)"
                >
                  <option v-for="opt in estadoOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
          </article>

          <p v-if="!turnosForSelectedDay.length" class="calendar-view__empty">No hay turnos para esta fecha.</p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="cancelAllModalOpen"
        class="calendar-view__modal-backdrop"
        role="presentation"
        @click.self="closeCancelAllModal"
      >
        <div
          class="calendar-view__modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="cancelAllStep === 1 ? 'cancel-all-title-1' : 'cancel-all-title-2'"
        >
          <template v-if="cancelAllStep === 1">
            <h2 id="cancel-all-title-1" class="calendar-view__modal-title">
              Cancelar todos los turnos
            </h2>
            <p class="calendar-view__modal-text">{{ cancelAllFirstMessage }}</p>
            <div class="calendar-view__modal-actions">
              <button type="button" class="calendar-view__modal-btn calendar-view__modal-btn--ghost" @click="closeCancelAllModal">
                No, volver
              </button>
              <button type="button" class="calendar-view__modal-btn calendar-view__modal-btn--danger" @click="advanceCancelAllStep">
                Sí, continuar
              </button>
            </div>
          </template>
          <template v-else>
            <h2 id="cancel-all-title-2" class="calendar-view__modal-title">Confirmación final</h2>
            <p class="calendar-view__modal-text">{{ cancelAllSecondMessage }}</p>
            <div class="calendar-view__modal-actions">
              <button type="button" class="calendar-view__modal-btn calendar-view__modal-btn--ghost" @click="cancelAllStep = 1">
                Volver
              </button>
              <button type="button" class="calendar-view__modal-btn calendar-view__modal-btn--danger" @click="confirmCancelAllTurnos">
                Sí, cancelar todos
              </button>
            </div>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.calendar-view {
  min-height: 100vh;
  background-color: var(--calendar-color-background);
  color: var(--calendar-color-on-surface);
  font-family: var(--font-family-body);
}

.calendar-view__topbar {
  width: 100%;
  height: var(--calendar-header-height);
  padding: 0 var(--calendar-space-content-x);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 40;
  background: transparent;
}

.calendar-view__topbar-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--calendar-letter-spacing-tight);
  color: var(--calendar-color-on-surface);
}

.calendar-view__topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.calendar-view__search {
  position: relative;
}

.calendar-view__search-icon {
  position: absolute;
  inset: 0 auto 0 var(--space-3);
  margin: auto 0;
  height: fit-content;
  font-size: var(--font-size-sm);
  color: var(--calendar-color-secondary);
  pointer-events: none;
}

.calendar-view__search-input {
  background-color: var(--calendar-color-surface-container-low);
  border: none;
  border-radius: var(--calendar-radius-pill);
  padding: var(--space-2) var(--space-4) var(--space-2) var(--space-10);
  font-size: var(--font-size-sm);
  width: 16rem;
  color: var(--calendar-color-on-surface);
  outline: none;
  transition: box-shadow var(--transition-base);
}

.calendar-view__search-input:focus {
  box-shadow: 0 0 0 2px var(--calendar-search-focus-ring);
}

.calendar-view__topbar-icons {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.calendar-view__icon-btn {
  border: none;
  background: transparent;
  border-radius: var(--calendar-radius-pill);
  padding: var(--space-2);
  cursor: pointer;
  color: var(--calendar-color-secondary);
  transition: background-color var(--transition-base);
}

.calendar-view__icon-btn:hover {
  background-color: var(--calendar-color-surface-container-low);
}

.calendar-view__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--calendar-radius-pill);
  background-color: var(--calendar-color-primary-container);
  color: var(--calendar-color-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
}

.calendar-view__content {
  padding: 0 var(--calendar-space-content-x) var(--calendar-space-content-bottom);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.calendar-view__page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.calendar-view__kicker {
  margin: 0 0 var(--space-1);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--calendar-letter-spacing-widest);
  color: var(--calendar-color-secondary);
}

.calendar-view__day-title {
  margin: 0;
  font-size: var(--calendar-font-size-display);
  font-weight: var(--calendar-font-weight-extrabold);
  letter-spacing: var(--calendar-letter-spacing-tight);
}

.calendar-view__cancel-all {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--calendar-radius-pill);
  font-family: inherit;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  background-color: var(--calendar-color-surface-container-high);
  color: var(--calendar-color-error);
  transition:
    background-color var(--transition-slow),
    color var(--transition-slow);
}

.calendar-view__cancel-all:hover {
  background-color: var(--calendar-color-error-container);
  color: var(--calendar-color-on-error-container);
}

.calendar-view__bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--calendar-space-bento-gap);
  align-items: flex-start;
}

.calendar-view__col-left {
  grid-column: span 12;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (min-width: 1024px) {
  .calendar-view__col-left {
    grid-column: span 4;
  }

  .calendar-view__col-right {
    grid-column: span 8;
  }
}

.calendar-view__card {
  background-color: var(--calendar-color-surface-container-lowest);
  border-radius: var(--calendar-radius-card);
  border: 1px solid var(--calendar-border-subtle);
  box-shadow: var(--shadow-sm);
}

.calendar-view__card--calendar {
  padding: var(--space-8);
}

.calendar-view__cal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.calendar-view__cal-month {
  margin: 0;
  font-weight: var(--font-weight-bold);
  color: var(--calendar-color-on-surface);
}

.calendar-view__cal-nav {
  display: flex;
  gap: var(--space-1);
}

.calendar-view__cal-nav-btn {
  border: none;
  background: transparent;
  padding: var(--space-1);
  border-radius: var(--radius-lg);
  cursor: pointer;
  color: inherit;
  transition: background-color var(--transition-base);
}

.calendar-view__cal-nav-btn:hover {
  background-color: var(--calendar-color-surface-container-low);
}

.calendar-view__cal-nav-ic {
  font-size: var(--font-size-sm);
}

.calendar-view__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-2);
  text-align: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--calendar-color-secondary);
  margin-bottom: var(--space-4);
}

.calendar-view__weekday {
  display: block;
}

.calendar-view__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-2);
  text-align: center;
}

.calendar-view__day {
  border: none;
  background: transparent;
  padding: var(--space-2);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-family: inherit;
  color: var(--calendar-color-on-surface);
  transition: background-color var(--transition-base);
}

.calendar-view__day--outside {
  color: var(--calendar-color-outline-variant);
}

.calendar-view__day:hover:not(.calendar-view__day--selected) {
  background-color: var(--calendar-color-surface-container-low);
}

.calendar-view__day--selected {
  background-color: var(--calendar-color-primary);
  color: var(--calendar-color-on-primary);
  font-weight: var(--font-weight-bold);
  box-shadow: var(--calendar-shadow-day-selected);
  cursor: default;
}

.calendar-view__summary {
  display: block;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background-color: var(--calendar-color-primary);
  padding: var(--space-8);
  border-radius: var(--calendar-radius-card);
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: left;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.calendar-view__summary:hover {
  transform: scale(1.01);
  box-shadow: var(--shadow-md);
}

.calendar-view__summary-inner {
  position: relative;
  z-index: 2;
  color: var(--calendar-color-on-primary);
}

.calendar-view__summary-label {
  margin: 0 0 var(--space-1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: color-mix(in srgb, var(--calendar-color-primary-fixed) 80%, transparent);
}

.calendar-view__summary-count {
  margin: 0 0 var(--space-4);
  font-size: var(--calendar-font-size-summary-count);
  font-weight: var(--calendar-font-weight-black);
}

.calendar-view__summary-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
}

.calendar-view__chip {
  background-color: var(--calendar-summary-chip-bg);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--calendar-radius-pill);
  font-size: var(--font-size-xs);
  backdrop-filter: blur(4px);
}

.calendar-view__summary-deco {
  position: absolute;
  right: -1rem;
  bottom: -1rem;
  z-index: 1;
  opacity: var(--calendar-summary-icon-opacity);
  pointer-events: none;
}

.calendar-view__summary-deco-icon {
  font-size: var(--calendar-summary-decor-size);
}

.calendar-view__col-right {
  grid-column: span 12;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.calendar-view__turn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-6);
  background-color: var(--calendar-color-surface-container-lowest);
  border-radius: var(--calendar-radius-card);
  border: 1px solid var(--calendar-border-row);
  transition:
    box-shadow var(--transition-slow),
    border-color var(--transition-slow);
}

.calendar-view__turn:hover {
  box-shadow: var(--calendar-shadow-row-hover);
}

.calendar-view__turn:focus {
  outline: 2px solid var(--calendar-color-primary);
  outline-offset: 2px;
}

.calendar-view__turn--next {
  border-color: var(--calendar-ring-primary-border);
  box-shadow: 0 0 0 2px var(--calendar-ring-primary-soft);
}

.calendar-view__turn-main {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  min-width: 0;
}

.calendar-view__turn-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.calendar-view__turn-clock {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.calendar-view__turn-clock--accent {
  color: var(--calendar-color-primary);
}

.calendar-view__turn-meridiem {
  font-size: var(--calendar-font-size-2xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--calendar-letter-spacing-tight);
  color: var(--calendar-color-secondary);
}

.calendar-view__turn-meridiem--accent {
  color: var(--calendar-color-primary);
}

.calendar-view__turn-rule {
  width: var(--calendar-divider-width);
  height: 2.5rem;
  border-radius: var(--calendar-radius-pill);
  flex-shrink: 0;
}

.calendar-view__turn-rule--primary {
  background-color: var(--calendar-color-primary);
}

.calendar-view__turn-rule--tertiary {
  background-color: var(--calendar-color-tertiary-container);
}

.calendar-view__turn-text {
  min-width: 0;
}

.calendar-view__turn-name-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.calendar-view__turn-name {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.calendar-view__turn-badge {
  font-size: var(--calendar-font-size-2xs);
  font-weight: var(--calendar-font-weight-black);
  text-transform: uppercase;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--calendar-radius-pill);
  background-color: var(--calendar-primary-muted-bg);
  color: var(--calendar-color-primary);
}

.calendar-view__turn-service {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--calendar-color-secondary);
}

.calendar-view__turn-aside {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex-shrink: 0;
}

.calendar-view__pill {
  padding: var(--space-1) var(--space-4);
  border-radius: var(--calendar-radius-pill);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--calendar-letter-spacing-widest);
  white-space: nowrap;
}

.calendar-view__pill--confirmado {
  background-color: var(--calendar-color-status-confirmado-bg);
  color: var(--calendar-color-status-confirmado-text);
}

.calendar-view__pill--pendiente {
  background-color: var(--calendar-color-secondary-container);
  color: var(--calendar-color-on-secondary-container);
}

.calendar-view__pill--cancelado {
  background-color: var(--calendar-color-status-cancelado-bg);
  color: var(--calendar-color-status-cancelado-text);
}

.calendar-view__status-select-wrap {
  min-width: 8.5rem;
}

.calendar-view__status-select {
  width: 100%;
  font-family: inherit;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--space-2) var(--space-8) var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  border: 1px solid var(--calendar-border-subtle);
  background-color: var(--calendar-color-surface-container-low);
  color: var(--calendar-color-on-surface);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23727785' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-1) center;
  background-size: 1.25rem;
}

.calendar-view__status-select:focus {
  outline: 2px solid var(--calendar-search-focus-ring);
  outline-offset: 1px;
}

.calendar-view__empty {
  text-align: center;
  color: var(--calendar-color-secondary);
  padding: var(--space-8);
  margin: 0;
}

.calendar-view__modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(25, 27, 35, 0.45);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.calendar-view__modal {
  width: 100%;
  max-width: 26rem;
  background: var(--calendar-color-surface-container-lowest);
  border-radius: var(--calendar-radius-card);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--calendar-border-subtle);
}

.calendar-view__modal-title {
  margin: 0 0 var(--space-4);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.calendar-view__modal-text {
  margin: 0 0 var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--calendar-color-secondary);
  line-height: var(--line-height-normal);
}

.calendar-view__modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: flex-end;
}

.calendar-view__modal-btn {
  font-family: inherit;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  cursor: pointer;
  border: none;
  transition: opacity var(--transition-fast);
}

.calendar-view__modal-btn--ghost {
  background: transparent;
  color: var(--calendar-color-on-surface);
  border: 1px solid var(--calendar-border-subtle);
}

.calendar-view__modal-btn--danger {
  background: var(--calendar-color-error);
  color: var(--calendar-color-on-primary);
}

.calendar-view__modal-btn:hover {
  opacity: 0.92;
}

</style>
