<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const days = ref([
  { id: 'lunes', name: 'Lunes', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'martes', name: 'Martes', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'miercoles', name: 'Miércoles', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'jueves', name: 'Jueves', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'viernes', name: 'Viernes', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'sabado', name: 'Sábado', active: false, start: '09:00', end: '13:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'domingo', name: 'Domingo', active: false, start: '09:00', end: '13:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' }
])

const turnMargin = ref<number | 'custom'>(15)
const previousTurnMargin = ref<number | 'custom'>(15)
const customTurnMarginValue = ref<number>(60)

function copyToAll(sourceDay: typeof days.value[0]) {
  days.value.forEach(day => {
    if (day.id !== sourceDay.id && day.active) {
      day.start = sourceDay.start
      day.end = sourceDay.end
      day.hasBreak = sourceDay.hasBreak
      day.breakStart = sourceDay.breakStart
      day.breakEnd = sourceDay.breakEnd
    }
  })
}

function updateDayTime(day: typeof days.value[0], field: 'start' | 'end', event: Event) {
  const target = event.target as HTMLInputElement
  const newValue = target.value

  if (field === 'start') {
    if (newValue >= day.end) {
      toast.error('La hora de inicio de la jornada debe ser menor a la hora de fin.')
      target.value = day.start
      return
    }
    day.start = newValue
  } else {
    if (newValue <= day.start) {
      toast.error('La hora de fin de la jornada debe ser mayor a la hora de inicio.')
      target.value = day.end
      return
    }
    day.end = newValue
  }

  if (day.hasBreak) {
    if (day.breakStart < day.start || day.breakEnd > day.end) {
      toast.warning('Atención: El nuevo horario de la jornada invalida el descanso. Por favor configúrelo nuevamente.')
      day.hasBreak = false
    }
  }
}

// Modal Descanso/Almuerzo
const showBreakModal = ref(false)
const selectedDayForBreak = ref<typeof days.value[0] | null>(null)
const tempBreakStart = ref('')
const tempBreakEnd = ref('')

function openBreakModal(day: typeof days.value[0]) {
  selectedDayForBreak.value = day
  tempBreakStart.value = day.breakStart || '13:00'
  tempBreakEnd.value = day.breakEnd || '14:00'
  showBreakModal.value = true
}

function saveBreak() {
  if (selectedDayForBreak.value) {
    if (tempBreakStart.value >= tempBreakEnd.value) {
      toast.error('La hora de inicio del descanso debe ser menor a la hora de fin.')
      return
    }
    if (tempBreakStart.value < selectedDayForBreak.value.start || tempBreakEnd.value > selectedDayForBreak.value.end) {
      toast.error(`El descanso debe estar dentro del horario de la jornada (${selectedDayForBreak.value.start} a ${selectedDayForBreak.value.end}).`)
      return
    }
    selectedDayForBreak.value.hasBreak = true
    selectedDayForBreak.value.breakStart = tempBreakStart.value
    selectedDayForBreak.value.breakEnd = tempBreakEnd.value
  }
  showBreakModal.value = false
}

function removeBreak() {
  if (selectedDayForBreak.value) {
    selectedDayForBreak.value.hasBreak = false
  }
  showBreakModal.value = false
}

// Modal Margen Personalizado
const showMarginModal = ref(false)

function onMarginChange() {
  if (turnMargin.value === 'custom') {
    showMarginModal.value = true
  } else {
    previousTurnMargin.value = turnMargin.value
  }
}

function saveCustomMargin() {
  showMarginModal.value = false
  previousTurnMargin.value = 'custom'
}

function cancelCustomMargin() {
  showMarginModal.value = false
  turnMargin.value = previousTurnMargin.value
}

// Modal Feriados
const showHolidaysModal = ref(false)
const holidays = ref<{ date: string, description: string }[]>([])
const newHolidayDate = ref('')
const newHolidayDesc = ref('')

function openHolidaysModal() {
  showHolidaysModal.value = true
}

function addHoliday() {
  if (newHolidayDate.value) {
    holidays.value.push({ date: newHolidayDate.value, description: newHolidayDesc.value })
    holidays.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    newHolidayDate.value = ''
    newHolidayDesc.value = ''
  }
}

function removeHoliday(index: number) {
  holidays.value.splice(index, 1)
}

function closeHolidaysModal() {
  showHolidaysModal.value = false
}
</script>

<template>
  <div class="config-horarios">
    <div class="config-horarios__container">
      
      <div class="config-horarios__header-wrapper">
        <div class="config-horarios__header-text">
          <h2 class="config-horarios__title">Configuración de Horarios</h2>
          <p class="config-horarios__description">
            Define tu disponibilidad semanal para que tus clientes puedan reservar turnos de manera automática.
          </p>
        </div>
        <div class="config-horarios__timezone">
          <span class="material-symbols-outlined config-horarios__timezone-icon">info</span>
          Zona horaria: (GMT-3) Buenos Aires
        </div>
      </div>

      <div class="config-horarios__card">
        <div class="config-horarios__list">
          
          <div 
            v-for="(day, index) in days" 
            :key="day.id"
            class="config-horarios__day"
            :class="{ 'config-horarios__day--last': index === days.length - 1 }"
          >
            <div class="config-horarios__day-info">
              <input 
                type="checkbox" 
                v-model="day.active" 
                class="config-horarios__checkbox" 
              />
              <span 
                class="config-horarios__day-name"
                :class="{ 'config-horarios__day-name--disabled': !day.active }"
              >
                {{ day.name }}
              </span>
            </div>
            
            <div v-if="day.active" class="config-horarios__day-inputs">
              <div class="config-horarios__time-input">
                <input 
                  type="time" 
                  :value="day.start"
                  @change="updateDayTime(day, 'start', $event)"
                  class="config-horarios__time-field" 
                />
              </div>
              <span class="config-horarios__time-sep">a</span>
              <div class="config-horarios__time-input">
                <input 
                  type="time" 
                  :value="day.end"
                  @change="updateDayTime(day, 'end', $event)"
                  class="config-horarios__time-field" 
                />
              </div>

              <!-- Break / Almuerzo -->
              <div class="config-horarios__break-container">
                <button 
                  class="config-horarios__break-btn" 
                  :class="{ 'config-horarios__break-btn--active': day.hasBreak }"
                  @click="openBreakModal(day)"
                  title="Configurar descanso o almuerzo"
                >
                  <span class="material-symbols-outlined" style="font-size: 16px">lunch_dining</span>
                  <span v-if="day.hasBreak" class="config-horarios__break-text">
                    {{ day.breakStart }} - {{ day.breakEnd }}
                  </span>
                </button>
              </div>

              <button class="config-horarios__copy-btn" @click="copyToAll(day)" title="Copiar a los demás días activos">
                <span class="material-symbols-outlined">content_copy</span>
              </button>
            </div>
            <div v-else class="config-horarios__day-inputs">
              <span class="config-horarios__closed">Cerrado</span>
            </div>
          </div>

        </div>

        <div class="config-horarios__advanced">
          <h4 class="config-horarios__advanced-title">Configuraciones Adicionales</h4>
          <div class="config-horarios__advanced-tags">
            <div class="config-horarios__tag" @click="openHolidaysModal">
              <span class="material-symbols-outlined">event_busy</span>
              Excepciones de feriados
              <span v-if="holidays.length > 0" class="config-horarios__badge">{{ holidays.length }}</span>
            </div>
            <div class="config-horarios__tag config-horarios__tag--input">
              <span class="material-symbols-outlined">update</span>
              Margen entre turnos:
              <select v-model="turnMargin" @change="onMarginChange" class="config-horarios__margin-select">
                <option :value="0">0 min</option>
                <option :value="5">5 min</option>
                <option :value="10">10 min</option>
                <option :value="15">15 min</option>
                <option :value="30">30 min</option>
                <option :value="60">60 min</option>
                <option value="custom">Otro{{ turnMargin === 'custom' ? ` (${customTurnMarginValue} min)` : '' }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="config-horarios__footer">
          <p class="config-horarios__footer-text">Los cambios se aplicarán inmediatamente a tu calendario público.</p>
          <div class="config-horarios__footer-actions">
            <button class="config-horarios__btn-discard">Descartar</button>
            <button class="config-horarios__btn-save">Guardar horarios</button>
          </div>
        </div>
      </div>

      <div class="config-horarios__context">
        <div class="config-horarios__context-image">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5kigOVZNXGjv_Iw0CCoXpZp-gKMxyBeD9c9fuNAmiw_tngakC0So6JqRfy4MiGQUYoIxffJ7w5TfA4DtttzIsSCsKD1o3EE9m_9O0yfoZ9XSR-7SSQ_4D1R63ZlW8relAZ37GomJJBlY2-BM9Cb7P2nv4-CbgXC-MT4RMmQbDcSGR9MhMoBUzhWe3p-OVCq72kQrubFtmHOM6R8Y2Mqcq0lu2i6JQrfQWjzhF3tL5v1JXSlRx_LoO_BMUiVqpUHZJ0y3jOqKNT8Y" alt="Calendar Planner" />
          <div class="config-horarios__context-overlay"></div>
          <div class="config-horarios__context-overlay-text">
            <span class="config-horarios__context-tip-label">Tip Pro</span>
            <p class="config-horarios__context-tip-desc">Usa el botón de copiar para aplicar el mismo horario a toda la semana.</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Descanso -->
    <div v-if="showBreakModal" class="config-horarios__modal-overlay" @click.self="showBreakModal = false">
      <div class="config-horarios__modal">
        <h3 class="config-horarios__modal-title">Horario de descanso</h3>
        <p class="config-horarios__modal-desc">
          Configura el horario de almuerzo o descanso para el {{ selectedDayForBreak?.name.toLowerCase() }}.
        </p>
        
        <div class="config-horarios__modal-body">
          <div class="config-horarios__modal-row">
            <div class="config-horarios__modal-field">
              <label>Desde</label>
              <div class="config-horarios__time-input">
                <input type="time" v-model="tempBreakStart" class="config-horarios__time-field" />
              </div>
            </div>
            <div class="config-horarios__modal-field">
              <label>Hasta</label>
              <div class="config-horarios__time-input">
                <input type="time" v-model="tempBreakEnd" class="config-horarios__time-field" />
              </div>
            </div>
          </div>
        </div>

        <div class="config-horarios__modal-actions">
          <button v-if="selectedDayForBreak?.hasBreak" class="config-horarios__btn-danger" @click="removeBreak">
            Eliminar
          </button>
          <div style="flex-grow: 1"></div>
          <button class="config-horarios__btn-secondary" @click="showBreakModal = false">Cancelar</button>
          <button class="config-horarios__btn-primary" @click="saveBreak">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Modal Margen Personalizado -->
    <div v-if="showMarginModal" class="config-horarios__modal-overlay" @click.self="cancelCustomMargin">
      <div class="config-horarios__modal">
        <h3 class="config-horarios__modal-title">Margen entre turnos</h3>
        <p class="config-horarios__modal-desc">
          Ingresa la cantidad de minutos que deseas dejar como margen entre cada turno.
        </p>
        
        <div class="config-horarios__modal-body">
          <div class="config-horarios__modal-field">
            <label>Minutos</label>
            <input type="number" v-model="customTurnMarginValue" class="config-horarios__input-number" min="1" />
          </div>
        </div>

        <div class="config-horarios__modal-actions">
          <button class="config-horarios__btn-secondary" @click="cancelCustomMargin">Cancelar</button>
          <button class="config-horarios__btn-primary" @click="saveCustomMargin">Aplicar</button>
        </div>
      </div>
    </div>

    <!-- Modal Feriados -->
    <div v-if="showHolidaysModal" class="config-horarios__modal-overlay" @click.self="closeHolidaysModal">
      <div class="config-horarios__modal config-horarios__modal--lg">
        <h3 class="config-horarios__modal-title">Excepciones de feriados</h3>
        <p class="config-horarios__modal-desc">
          Agrega fechas en las que no estarás disponible (feriados, vacaciones, etc.).
        </p>
        
        <div class="config-horarios__modal-body">
          <div class="config-horarios__holiday-form">
            <input type="date" v-model="newHolidayDate" class="config-horarios__input-text" />
            <input type="text" v-model="newHolidayDesc" placeholder="Descripción (ej. Feriado)" class="config-horarios__input-text" @keyup.enter="addHoliday" />
            <button class="config-horarios__btn-primary config-horarios__btn-primary--small" :disabled="!newHolidayDate" @click="addHoliday">
              Añadir
            </button>
          </div>

          <div class="config-horarios__holiday-list">
            <div v-if="holidays.length === 0" class="config-horarios__holiday-empty">
              No hay feriados configurados.
            </div>
            <div v-for="(holiday, index) in holidays" :key="index" class="config-horarios__holiday-item">
              <div class="config-horarios__holiday-info">
                <span class="config-horarios__holiday-date">
                  {{ new Date(holiday.date + 'T00:00:00').toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
                </span>
                <span class="config-horarios__holiday-desc">{{ holiday.description || 'Feriado' }}</span>
              </div>
              <button class="config-horarios__holiday-delete" @click="removeHoliday(index)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>

        <div class="config-horarios__modal-actions">
          <button class="config-horarios__btn-primary" @click="closeHolidaysModal">Listo</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-horarios__container {
  max-width: 56rem; /* max-w-4xl */
  margin: 0 auto;
}

.config-horarios__header-wrapper {
  margin-bottom: var(--space-12);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .config-horarios__header-wrapper {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.config-horarios__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.025em;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.config-horarios__description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 36rem;
}

.config-horarios__timezone {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-secondary-container);
  color: var(--color-on-secondary-container);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.config-horarios__timezone-icon {
  font-size: var(--font-size-sm);
}

.config-horarios__card {
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-xl);
}

.config-horarios__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.config-horarios__day {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-2) 0;
  min-height: 48px;
}

.config-horarios__day:hover .config-horarios__copy-btn {
  opacity: 1;
}

.config-horarios__day--last {
  border-bottom: 1px solid rgba(192, 200, 204, 0.1);
  padding-bottom: var(--space-6);
}

.config-horarios__day-info {
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.config-horarios__checkbox {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-md);
  border-color: var(--color-outline-variant);
  color: var(--color-primary-container);
  cursor: pointer;
}

.config-horarios__checkbox--small {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.config-horarios__day-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  user-select: none;
}

.config-horarios__day-name--disabled {
  color: var(--color-text-disabled);
}

.config-horarios__day-inputs {
  grid-column: span 10;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.config-horarios__time-input {
  display: flex;
  align-items: center;
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-xl);
  padding: var(--space-2) var(--space-5);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
  width: 100px;
}

.config-horarios__time-input:focus-within {
  border-color: rgba(0, 73, 122, 0.3);
  background-color: #fff;
}

.config-horarios__time-field {
  background: transparent;
  border: none;
  padding: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  width: 100%;
  font-family: inherit;
  color: var(--color-text-primary);
  cursor: pointer;
}

.config-horarios__time-field:focus {
  outline: none;
  box-shadow: none;
}

.config-horarios__time-sep {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Break styles */
.config-horarios__break-container {
  margin-left: var(--space-2);
}

.config-horarios__break-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-outline-variant);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.config-horarios__break-btn:hover {
  background-color: var(--color-surface-container-high);
}

.config-horarios__break-btn--active {
  background-color: rgba(186, 26, 26, 0.05);
  color: #ba1a1a;
  border-color: rgba(186, 26, 26, 0.2);
}

.config-horarios__break-btn--active:hover {
  background-color: rgba(186, 26, 26, 0.1);
}

.config-horarios__break-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.config-horarios__copy-btn {
  margin-left: var(--space-4);
  padding: var(--space-2);
  color: var(--color-text-disabled);
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition-fast);
}

.config-horarios__copy-btn:hover {
  color: var(--color-primary-container);
}

.config-horarios__closed {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-style: italic;
}

.config-horarios__advanced {
  padding-top: var(--space-4);
}

.config-horarios__advanced-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}

.config-horarios__advanced-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.config-horarios__tag {
  background-color: var(--color-surface-container-high);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-secondary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.config-horarios__badge {
  background-color: var(--color-primary-container);
  color: #fff;
  border-radius: var(--radius-full);
  padding: 0 var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-horarios__tag--input {
  cursor: default;
}

.config-horarios__tag--input:hover {
  background-color: var(--color-surface-container-high);
}

.config-horarios__tag:hover {
  background-color: var(--color-secondary-container);
}

.config-horarios__margin-select {
  background: transparent;
  border: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-container);
  cursor: pointer;
  outline: none;
}

.config-horarios__footer {
  padding-top: var(--space-8);
  margin-top: var(--space-8);
  border-top: 1px solid rgba(192, 200, 204, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.config-horarios__footer-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  max-width: 20rem;
}

.config-horarios__footer-actions {
  display: flex;
  gap: var(--space-4);
}

.config-horarios__btn-discard {
  padding: var(--space-2) var(--space-6);
  color: var(--color-primary-container);
  font-weight: var(--font-weight-bold);
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.config-horarios__btn-discard:hover {
  background-color: var(--color-surface-container-high);
}

.config-horarios__btn-save {
  padding: var(--space-2) var(--space-8);
  background: var(--gradient-primary);
  color: #fff;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-primary);
  transition: transform var(--transition-fast);
}

.config-horarios__btn-save:hover {
  transform: scale(1.05);
}

.config-horarios__context {
  margin-top: var(--space-12);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: flex-start;
}

.config-horarios__context-image {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  height: 100%;
  min-height: 240px;
}

.config-horarios__context-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  opacity: 0.5;
  transition: all 700ms;
}

.config-horarios__context-image:hover img {
  filter: grayscale(0%);
  transform: scale(1.05);
}

.config-horarios__context-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 73, 122, 0.4), transparent);
}

.config-horarios__context-overlay-text {
  position: absolute;
  bottom: var(--space-6);
  left: var(--space-6);
  right: var(--space-6);
}

.config-horarios__context-tip-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.8);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-1);
  display: block;
}

.config-horarios__context-tip-desc {
  color: #fff;
  font-weight: var(--font-weight-medium);
}

/* Modals */
.config-horarios__modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.config-horarios__modal {
  background: var(--color-surface-container-lowest, #fff);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
}

.config-horarios__modal--lg {
  max-width: 500px;
}

.config-horarios__modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.config-horarios__modal-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.config-horarios__modal-body {
  margin-bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.config-horarios__modal-row {
  display: flex;
  gap: var(--space-4);
}

.config-horarios__modal-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.config-horarios__modal-field label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.config-horarios__input-number,
.config-horarios__input-text {
  background-color: var(--color-surface-container-low, #f5f5f5);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color var(--transition-fast);
}

.config-horarios__input-number:focus,
.config-horarios__input-text:focus {
  outline: none;
  border-color: rgba(0, 73, 122, 0.3);
  background-color: #fff;
}

.config-horarios__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: auto;
}

.config-horarios__btn-secondary {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-outline-variant, #ccc);
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  font-weight: var(--font-weight-bold);
  transition: background-color var(--transition-fast);
}

.config-horarios__btn-secondary:hover {
  background-color: var(--color-surface-container-high, #eee);
}

.config-horarios__btn-primary {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-primary-container, #00497a);
  color: #fff;
  cursor: pointer;
  font-weight: var(--font-weight-bold);
  transition: opacity var(--transition-fast);
}

.config-horarios__btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.config-horarios__btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.config-horarios__btn-primary--small {
  padding: var(--space-2) var(--space-3);
}

.config-horarios__btn-danger {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: none;
  background: rgba(186, 26, 26, 0.1);
  color: #ba1a1a;
  cursor: pointer;
  font-weight: var(--font-weight-bold);
  transition: background-color var(--transition-fast);
}

.config-horarios__btn-danger:hover {
  background: rgba(186, 26, 26, 0.2);
}

/* Feriados */
.config-horarios__holiday-form {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.config-horarios__holiday-form input[type="date"] {
  flex: 0 0 140px;
}

.config-horarios__holiday-form input[type="text"] {
  flex: 1;
}

.config-horarios__holiday-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-height: 200px;
  overflow-y: auto;
  padding-right: var(--space-2);
}

.config-horarios__holiday-empty {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
  padding: var(--space-4) 0;
  font-style: italic;
}

.config-horarios__holiday-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3);
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-lg);
}

.config-horarios__holiday-info {
  display: flex;
  flex-direction: column;
}

.config-horarios__holiday-date {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-transform: capitalize;
}

.config-horarios__holiday-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.config-horarios__holiday-delete {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.config-horarios__holiday-delete:hover {
  background-color: rgba(186, 26, 26, 0.1);
  color: #ba1a1a;
}
</style>