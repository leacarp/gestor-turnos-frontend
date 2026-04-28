<script setup lang="ts">
import { ref } from 'vue'

const days = ref([
  { id: 'lunes', name: 'Lunes', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'martes', name: 'Martes', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'miercoles', name: 'Miércoles', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'jueves', name: 'Jueves', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'viernes', name: 'Viernes', active: true, start: '09:00', end: '18:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'sabado', name: 'Sábado', active: false, start: '09:00', end: '13:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  { id: 'domingo', name: 'Domingo', active: false, start: '09:00', end: '13:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' }
])

const turnMargin = ref(15)

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
                  v-model="day.start" 
                  class="config-horarios__time-field" 
                />
              </div>
              <span class="config-horarios__time-sep">a</span>
              <div class="config-horarios__time-input">
                <input 
                  type="time" 
                  v-model="day.end" 
                  class="config-horarios__time-field" 
                />
              </div>

              <!-- Break / Almuerzo -->
              <div class="config-horarios__break-toggle" title="Añadir descanso/almuerzo">
                <label class="config-horarios__break-label">
                  <input type="checkbox" v-model="day.hasBreak" class="config-horarios__checkbox config-horarios__checkbox--small" />
                  <span class="material-symbols-outlined" style="font-size: 16px">lunch_dining</span>
                </label>
              </div>

              <template v-if="day.hasBreak">
                <div class="config-horarios__time-input config-horarios__time-input--break">
                  <input 
                    type="time" 
                    v-model="day.breakStart" 
                    class="config-horarios__time-field config-horarios__time-field--break" 
                  />
                </div>
                <span class="config-horarios__time-sep">a</span>
                <div class="config-horarios__time-input config-horarios__time-input--break">
                  <input 
                    type="time" 
                    v-model="day.breakEnd" 
                    class="config-horarios__time-field config-horarios__time-field--break" 
                  />
                </div>
              </template>

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
            <div class="config-horarios__tag">
              <span class="material-symbols-outlined">event_busy</span>
              Excepciones de feriados
            </div>
            <div class="config-horarios__tag config-horarios__tag--input">
              <span class="material-symbols-outlined">update</span>
              Margen entre turnos:
              <select v-model="turnMargin" class="config-horarios__margin-select">
                <option :value="0">0 min</option>
                <option :value="5">5 min</option>
                <option :value="10">10 min</option>
                <option :value="15">15 min</option>
                <option :value="30">30 min</option>
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
  padding: var(--space-2) var(--space-4);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
  width: 100px;
}

.config-horarios__time-input--break {
  background-color: rgba(186, 26, 26, 0.05); /* very soft red for break */
  border: 1px dashed rgba(186, 26, 26, 0.2);
}

.config-horarios__time-input--break:focus-within {
  background-color: #fff;
  border-color: rgba(186, 26, 26, 0.5);
}

.config-horarios__break-toggle {
  display: flex;
  align-items: center;
  margin-left: var(--space-2);
  margin-right: var(--space-2);
}

.config-horarios__break-label {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-secondary);
  cursor: pointer;
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

.config-horarios__time-field--break {
  color: #ba1a1a; /* error color for break */
}

.config-horarios__time-field:focus {
  outline: none;
  box-shadow: none;
}

.config-horarios__time-sep {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
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

.config-horarios__tag--input {
  cursor: default;
}

.config-horarios__tag--input:hover {
  background-color: var(--color-surface-container-high);
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

.config-horarios__tag:hover {
  background-color: var(--color-secondary-container);
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
</style>
