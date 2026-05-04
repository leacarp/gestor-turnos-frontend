<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppSelect from '@/components/AppSelect.vue'

export type EstadoTurnoAgenda = 'confirmado' | 'pendiente' | 'cancelado' | 'finalizado'

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
  { value: 'finalizado', label: 'Finalizado' },
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

function deleteTurno(id: string) {
  turnos.value = turnos.value.filter(t => t.id !== id)
  toast.success('Turno eliminado')
}

function openCancelAllModal() {
  cancelAllModalOpen.value = true
}

function closeCancelAllModal() {
  cancelAllModalOpen.value = false
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
      <h1 class="calendar-view__topbar-title">Agenda del Proveedor</h1>
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
        <AppButton variant="outline" iconLeft="event_busy" @click="openCancelAllModal" style="color: #ba1a1a; border-color: rgba(186, 26, 26, 0.2); background: rgba(186, 26, 26, 0.05);">
          Cancelar todos
        </AppButton>
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
          <div
            v-for="t in turnosForSelectedDay"
            :key="t.id"
            class="calendar-view__turn-wrapper"
          >
            <div class="calendar-view__turn-delete-bg" v-if="t.estado === 'finalizado'">
              <button class="calendar-view__turn-delete-btn" @click.stop="deleteTurno(t.id)" aria-label="Eliminar turno">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
            <article
              class="calendar-view__turn"
              :class="{
                'calendar-view__turn--next': nextTurnoId === t.id,
                'calendar-view__turn--slidable': t.estado === 'finalizado'
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
                    'calendar-view__pill--finalizado': t.estado === 'finalizado',
                  }"
                >{{ t.estado }}</span>
                <div class="calendar-view__status-select-wrap" @click.stop @keydown.stop>
                  <AppSelect
                    :modelValue="t.estado"
                    :options="estadoOptions"
                    @update:modelValue="(v) => handleEstadoChange(t.id, { target: { value: v } } as any)"
                  />
                </div>
              </div>
            </article>
          </div>

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
          aria-labelledby="cancel-all-title"
        >
          <h2 id="cancel-all-title" class="calendar-view__modal-title">
            Cancelar todos los turnos
          </h2>
          <p class="calendar-view__modal-text">{{ cancelAllFirstMessage }}</p>
          <div class="calendar-view__modal-actions">
            <AppButton variant="outline" @click="closeCancelAllModal">
              Cancelar
            </AppButton>
            <AppButton variant="solid" style="background-color: #ba1a1a;" @click="confirmCancelAllTurnos">
              Sí, cancelar todos
            </AppButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.calendar-view {
  min-height: 100vh;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
}

.calendar-view__topbar {
  width: 100%;
  padding: var(--space-12) var(--space-12) var(--space-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
}

.calendar-view__topbar-title {
  margin: 0;
  font-size: var(--font-size-3xl);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--color-text-primary);
}

.calendar-view__topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.calendar-view__search {
  position: relative;
  display: flex;
  align-items: center;
}

.calendar-view__search-icon {
  position: absolute;
  left: var(--space-4);
  color: var(--color-outline);
  transition: color var(--transition-fast);
  pointer-events: none;
}

.calendar-view__search:focus-within .calendar-view__search-icon {
  color: var(--color-primary);
}

.calendar-view__search-input {
  width: 16rem;
  padding: var(--space-4) var(--space-4) var(--space-4) var(--space-12);
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-2xl);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--font-size-base);
  outline: none;
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.calendar-view__search-input::placeholder {
  color: var(--color-text-disabled);
}

.calendar-view__search-input:focus {
  background-color: var(--color-surface-container-lowest);
  box-shadow: 0 0 0 2px rgba(0, 50, 86, 0.2);
}

.calendar-view__topbar-icons {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.calendar-view__icon-btn {
  border: none;
  background: transparent;
  border-radius: var(--radius-full);
  padding: var(--space-2);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: background-color var(--transition-base);
}

.calendar-view__icon-btn:hover {
  background-color: var(--color-surface-container-low);
}

.calendar-view__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-container);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
}

.calendar-view__content {
  padding: 0 var(--space-12) var(--space-16);
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
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
}

.calendar-view__day-title {
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.calendar-view__bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
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
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-surface-container);
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
  color: var(--color-text-primary);
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
  background-color: var(--color-surface-container-low);
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
  color: var(--color-text-secondary);
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
  color: var(--color-text-primary);
  transition: background-color var(--transition-base);
}

.calendar-view__day--outside {
  color: var(--color-outline-variant);
}

.calendar-view__day:hover:not(.calendar-view__day--selected) {
  background-color: var(--color-surface-container-low);
}

.calendar-view__day--selected {
  background-color: var(--color-primary);
  color: #fff;
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow-sm);
  cursor: default;
}

.calendar-view__summary {
  display: block;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background-color: var(--color-primary);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
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
  color: #fff;
}

.calendar-view__summary-label {
  margin: 0 0 var(--space-1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: color-mix(in srgb, var(--color-primary-fixed) 80%, transparent);
}

.calendar-view__summary-count {
  margin: 0 0 var(--space-4);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
}

.calendar-view__summary-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
}

.calendar-view__chip {
  background-color: rgba(255, 255, 255, 0.2);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  backdrop-filter: blur(4px);
}

.calendar-view__summary-deco {
  position: absolute;
  right: -1rem;
  bottom: -1rem;
  z-index: 1;
  opacity: 0.2;
  pointer-events: none;
}

.calendar-view__summary-deco-icon {
  font-size: 120px;
}

.calendar-view__col-right {
  grid-column: span 12;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.calendar-view__turn-wrapper {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.calendar-view__turn-delete-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(186, 26, 26, 0.1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: var(--space-6);
  z-index: 0;
}

.calendar-view__turn-delete-btn {
  background-color: #ba1a1a;
  color: white;
  border: none;
  border-radius: var(--radius-full);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), background-color var(--transition-fast);
}

.calendar-view__turn-delete-btn:hover {
  transform: scale(1.1);
  background-color: #93000a;
}

.calendar-view__turn {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-6);
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-surface-container);
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow var(--transition-slow),
    border-color var(--transition-slow);
}

.calendar-view__turn-wrapper:hover .calendar-view__turn--slidable {
  transform: translateX(-70px);
}

.calendar-view__turn:hover {
  box-shadow: var(--shadow-md);
}

.calendar-view__turn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.calendar-view__turn--next {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 73, 122, 0.3);
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
  width: 4rem; /* Fijado para alinear correctamente la barra vertical */
}

.calendar-view__turn-clock {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.calendar-view__turn-clock--accent {
  color: var(--color-primary);
}

.calendar-view__turn-meridiem {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: -0.025em;
  color: var(--color-text-secondary);
}

.calendar-view__turn-meridiem--accent {
  color: var(--color-primary);
}

.calendar-view__turn-rule {
  width: 4px;
  height: 2.5rem;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.calendar-view__turn-rule--primary {
  background-color: var(--color-primary);
}

.calendar-view__turn-rule--tertiary {
  background-color: var(--color-surface-container-highest);
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
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  background-color: var(--color-primary-container);
  color: var(--color-primary);
}

.calendar-view__turn-service {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.calendar-view__turn-aside {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex-shrink: 0;
}

.calendar-view__pill {
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.calendar-view__pill--confirmado {
  background-color: #e6f4ea;
  color: #137333;
}

.calendar-view__pill--pendiente {
  background-color: var(--color-surface-container-high);
  color: var(--color-text-primary);
}

.calendar-view__pill--cancelado {
  background-color: #fce8e6;
  color: #c5221f;
}

.calendar-view__pill--finalizado {
  background-color: #f1d9f3;
  color: #9d28d3;
}

.calendar-view__status-select-wrap {
  min-width: 8.5rem;
}

.calendar-view__empty {
  text-align: center;
  color: var(--color-text-secondary);
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
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-surface-container);
}

.calendar-view__modal-title {
  margin: 0 0 var(--space-4);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.calendar-view__modal-text {
  margin: 0 0 var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.calendar-view__modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: flex-end;
}

</style>
