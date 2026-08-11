<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import AppButton from '@/components/AppButton.vue'
import { Icon } from '@iconify/vue'
import { userService } from '@/services/userService'

const telegramActive = ref(true)
const emailActive = ref(false)
const telegramChatId = ref('')

const tgReminders = ref({
  t12h: true,
  t3h: true
})

const emailReminders = ref({
  t12h: false
})

const messageTemplate = ref('Hola {nombre}, te recordamos tu turno para mañana a las {hora}. En caso de no poder asistir, por favor avísanos con tiempo. ¡Te esperamos!')

const loading = ref(true)
const saving = ref(false)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)
const isDirty = ref(false)

onMounted(async () => {
  try {
    const { data } = await userService.getMe()
    const settings = data.reminderSettings
    if (settings) {
      telegramActive.value = settings.telegram?.enabled ?? true
      tgReminders.value = {
        t12h: settings.telegram?.t12h ?? true,
        t3h: settings.telegram?.t3h ?? true,
      }
      telegramChatId.value = settings.telegram?.chatId ?? ''
      emailActive.value = settings.email?.enabled ?? false
      emailReminders.value = { t12h: settings.email?.t12h ?? false }
      messageTemplate.value = settings.messageTemplate ?? messageTemplate.value
    }
  } catch {
    saveError.value = 'No se pudo cargar la configuración actual.'
  } finally {
    loading.value = false
  }
})

watch(
  [telegramActive, emailActive, telegramChatId, tgReminders, emailReminders, messageTemplate],
  () => { if (!loading.value) isDirty.value = true },
  { deep: true }
)

function insertVariable(variable: string) {
  messageTemplate.value += ` ${variable}`
}

const previewMessage = computed(() => {
  let result = messageTemplate.value

  const variables: Record<string, string> = {
    '{nombre}': '<span class="config-recs__preview-highlight">Julián</span>',
    '{hora}': '<span class="config-recs__preview-highlight">15:30</span>',
    '{servicio}': '<span class="config-recs__preview-highlight">Corte de Cabello</span>',
    '{fecha}': '<span class="config-recs__preview-highlight">25 de Octubre</span>'
  }

  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(key, value)
  }

  return result
})

async function saveConfig() {
  saving.value = true
  saveError.value = null
  saveSuccess.value = false
  try {
    await userService.updateReminderSettings({
      telegram: {
        enabled: telegramActive.value,
        t12h: tgReminders.value.t12h,
        t3h: tgReminders.value.t3h,
        chatId: telegramChatId.value || undefined,
      },
      email: { enabled: emailActive.value, t12h: emailReminders.value.t12h },
      messageTemplate: messageTemplate.value,
    })
    saveSuccess.value = true
    isDirty.value = false
  } catch {
    saveError.value = 'Ocurrió un error al guardar. Intentá de nuevo.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="config-recs">
    <div class="config-recs__container">
      <header class="config-recs__header">
        <h2 class="config-recs__title">Recordatorios de Citas</h2>
        <p class="config-recs__description">
          Personaliza cómo y cuándo tus clientes reciben las notificaciones automáticas para reducir el ausentismo.
        </p>
      </header>

      <div class="config-recs__grid">
        <!-- Left Column -->
        <div class="config-recs__left">
          
          <!-- Telegram Channel -->
          <section class="config-recs__card">
            <div class="config-recs__card-header">
              <div class="config-recs__card-info">
                <div class="config-recs__icon-telegram">
                  <Icon icon="mdi:telegram" class="config-recs__brand-icon" />
                </div>
                <div>
                  <h3 class="config-recs__card-title">Canal Telegram</h3>
                  <p class="config-recs__card-subtitle">Te llega a vos como proveedor</p>
                </div>
              </div>
              <label class="config-recs__switch">
                <input type="checkbox" v-model="telegramActive" class="config-recs__switch-input" />
                <div class="config-recs__switch-bg"></div>
              </label>
            </div>

            <div class="config-recs__card-options" :class="{ 'config-recs__card-options--disabled': !telegramActive }">
              <label class="config-recs__option">
                <span class="config-recs__option-label">Recordatorio 12h antes</span>
                <input type="checkbox" v-model="tgReminders.t12h" class="config-recs__checkbox" />
              </label>
              <label class="config-recs__option">
                <span class="config-recs__option-label">Recordatorio 3h antes</span>
                <input type="checkbox" v-model="tgReminders.t3h" class="config-recs__checkbox" />
              </label>
              <div class="config-recs__field" style="margin-top: var(--space-2); margin-bottom: 0;">
                <label class="config-recs__label">Chat ID de Telegram</label>
                <input
                  type="text"
                  v-model="telegramChatId"
                  class="config-recs__textarea"
                  style="padding: var(--space-3);"
                  placeholder="Ej: 123456789"
                />
                <p class="config-recs__card-subtitle" style="margin-top: var(--space-2);">
                  Hablá con nuestro bot de Telegram y escribile <strong>/start</strong> para que te devuelva tu Chat ID.
                </p>
              </div>
            </div>
          </section>

          <!-- Email Channel -->
          <section class="config-recs__card">
            <div class="config-recs__card-header">
              <div class="config-recs__card-info">
                <div class="config-recs__icon-email">
                  <Icon icon="mdi:gmail" class="config-recs__brand-icon" />
                </div>
                <div>
                  <h3 class="config-recs__card-title">Canal Email</h3>
                  <p class="config-recs__card-subtitle">Respaldo formal</p>
                </div>
              </div>
              <label class="config-recs__switch">
                <input type="checkbox" v-model="emailActive" class="config-recs__switch-input" />
                <div class="config-recs__switch-bg"></div>
              </label>
            </div>
            
            <div class="config-recs__card-options" :class="{ 'config-recs__card-options--disabled': !emailActive }">
              <label class="config-recs__option">
                <span class="config-recs__option-label">Recordatorio 12h antes</span>
                <input type="checkbox" v-model="emailReminders.t12h" class="config-recs__checkbox" />
              </label>
            </div>
          </section>

          <!-- Summary Tip -->
          <div class="config-recs__tip">
            <span class="material-symbols-outlined config-recs__tip-icon">info</span>
            <p class="config-recs__tip-text">
              <strong>Tip:</strong> Activar Telegram reduce el ausentismo en un 35% en promedio frente a notificaciones por email.
            </p>
          </div>
        </div>

        <!-- Right Column -->
        <div class="config-recs__right">
          <section class="config-recs__editor-card">
            <div class="config-recs__editor-header">
              <h3 class="config-recs__editor-title">Editor de Mensajes</h3>
              <div class="config-recs__editor-tags">
              </div>
            </div>

            <div class="config-recs__field">
              <label class="config-recs__label">Plantilla de mensaje</label>
              <div class="config-recs__textarea-wrapper">
                <textarea 
                  class="config-recs__textarea" 
                  rows="6"
                  v-model="messageTemplate"
                ></textarea>
                <p v-if="messageTemplate.length > 160" style="color: firebrick; font-weight: bold;">
                  Límite excedido (máximo 160 caracteres)
                </p>
                <div class="config-recs__char-count">{{ messageTemplate.length }} / 160 caracteres</div>
              </div>
            </div>

            <div class="config-recs__field">
              <label class="config-recs__label">Insertar variables dinámicas</label>
              <div class="config-recs__variables">
                <button class="config-recs__var-btn" @click="insertVariable('{nombre}')">
                  <span class="material-symbols-outlined config-recs__var-icon">add_circle</span> {nombre}
                </button>
                <button class="config-recs__var-btn" @click="insertVariable('{hora}')">
                  <span class="material-symbols-outlined config-recs__var-icon">add_circle</span> {hora}
                </button>
                <button class="config-recs__var-btn" @click="insertVariable('{servicio}')">
                  <span class="material-symbols-outlined config-recs__var-icon">add_circle</span> {servicio}
                </button>
                <button class="config-recs__var-btn" @click="insertVariable('{fecha}')">
                  <span class="material-symbols-outlined config-recs__var-icon">add_circle</span> {fecha}
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div class="config-recs__preview">
              <div class="config-recs__preview-header">
                <span class="material-symbols-outlined config-recs__preview-icon">visibility</span>
                <span class="config-recs__preview-title">Vista previa del cliente</span>
              </div>
              <div class="config-recs__preview-bubble" v-html="previewMessage"></div>
            </div>

            <p v-if="saveSuccess" class="config-recs__save-success">Configuración guardada correctamente.</p>
            <p v-if="saveError" class="config-recs__save-error">{{ saveError }}</p>

            <div class="config-recs__actions">
              <AppButton variant="outline" :disabled="saving || !isDirty">Cancelar</AppButton>
              <AppButton variant="gradient" :disabled="saving || !isDirty" @click="saveConfig">
                {{ saving ? 'Guardando...' : 'Guardar configuración' }}
              </AppButton>
            </div>
          </section>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.config-recs__container {
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.config-recs__header {
  margin-bottom: var(--space-10);
}

.config-recs__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.025em;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.config-recs__description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  max-width: 42rem;
}

.config-recs__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: flex-start;
}

@media (min-width: 1024px) {
  .config-recs__grid {
    grid-template-columns: 5fr 7fr;
  }
}

.config-recs__left {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.config-recs__card {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(192, 200, 204, 0.1);
}

.config-recs__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.config-recs__card-info {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.config-recs__icon-telegram {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-xl);
  background-color: #f0fdf4; /* green-50 */
  color: #16a34a; /* green-600 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-recs__icon-email {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-xl);
  background-color: #eff6ff; /* blue-50 */
  color: #2563eb; /* blue-600 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-recs__brand-icon {
  font-size: 28px;
}

.config-recs__card-title {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.config-recs__card-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

/* Switch Styles */
.config-recs__switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 4px; /* Aumenta zona clickeable */
}

.config-recs__switch-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.config-recs__switch-bg {
  width: 48px;
  height: 26px;
  background-color: var(--color-surface-container-high);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.config-recs__switch-bg::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  border-radius: var(--radius-full);
  height: 20px;
  width: 20px;
  transition: all var(--transition-fast);
}

.config-recs__switch-input:checked + .config-recs__switch-bg {
  background-color: var(--color-primary-container);
  box-shadow: none;
}

.config-recs__switch-input:checked + .config-recs__switch-bg::after {
  transform: translateX(22px);
}

.config-recs__card-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  transition: opacity var(--transition-fast);
}

.config-recs__card-options--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.config-recs__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.config-recs__option:hover {
  background-color: var(--color-surface-container-low);
}

.config-recs__option-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  user-select: none;
}

.config-recs__checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--color-outline-variant);
  color: var(--color-primary-container);
  cursor: pointer;
  transition: all var(--transition-fast);
  accent-color: var(--color-primary-container); /* Fallback for browsers */
}

.config-recs__checkbox:checked {
  border-color: var(--color-primary-container);
}

.config-recs__tip {
  padding: var(--space-4);
  background-color: rgba(208, 228, 255, 0.3);
  border-radius: var(--radius-xl);
  display: flex;
  gap: var(--space-3);
}

.config-recs__tip-icon {
  color: var(--color-primary-container);
}

.config-recs__tip-text {
  font-size: var(--font-size-xs);
  color: var(--color-on-primary-fixed-variant);
  line-height: var(--line-height-normal);
}

/* Editor */
.config-recs__editor-card {
  background-color: var(--color-surface-container-lowest);
  padding: var(--space-5);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(192, 200, 204, 0.1);
}

@media (min-width: 768px) {
  .config-recs__editor-card {
    padding: var(--space-8);
  }
}

@media (min-width: 1024px) {
  .config-recs__editor-card {
    padding: var(--space-12);
  }
}

.config-recs__editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.config-recs__editor-title {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.config-recs__editor-tags {
  display: flex;
  gap: var(--space-2);
}

.config-recs__tag {
  padding: var(--space-1) var(--space-3);
  background-color: var(--color-surface-container);
  color: var(--color-text-secondary);
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.config-recs__field {
  margin-bottom: var(--space-4);
}

.config-recs__field:last-of-type {
  margin-bottom: var(--space-8);
}

.config-recs__label {
  display: block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-tertiary);
  margin-bottom: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.config-recs__textarea-wrapper {
  position: relative;
}

.config-recs__textarea {
  width: 100%;
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  resize: none;
  line-height: var(--line-height-normal);
  font-family: inherit;
}

.config-recs__textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 73, 122, 0.2);
}

.config-recs__char-count {
  position: absolute;
  bottom: var(--space-3);
  right: var(--space-3);
  font-size: 10px;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.config-recs__variables {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.config-recs__var-btn {
  padding: var(--space-1) var(--space-3);
  background-color: var(--color-surface);
  border: 1px solid rgba(192, 200, 204, 0.3);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.config-recs__var-btn:hover {
  border-color: rgba(0, 73, 122, 0.5);
}

.config-recs__var-icon {
  font-size: var(--font-size-sm);
}

/* Preview */
.config-recs__preview {
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  border: 1px solid rgba(192, 200, 204, 0.2);
}

.config-recs__preview-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.config-recs__preview-icon {
  font-size: var(--font-size-sm);
  color: #16a34a; /* green-600 */
}

.config-recs__preview-title {
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.config-recs__preview-bubble {
  max-width: 85%;
  background-color: #fff;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  border-top-left-radius: 0;
  box-shadow: var(--shadow-sm);
  font-size: var(--font-size-sm);
  border: 1px solid rgba(192, 200, 204, 0.1);
}

:deep(.config-recs__preview-highlight) {
  color: var(--color-primary-container);
  font-weight: var(--font-weight-semibold);
}

.config-recs__save-success {
  font-size: var(--font-size-sm);
  color: #16a34a;
  margin-top: var(--space-4);
}

.config-recs__save-error {
  font-size: var(--font-size-sm);
  color: firebrick;
  margin-top: var(--space-4);
}

.config-recs__actions {
  margin-top: var(--space-4);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-5);
}

/* Info Grid */
.config-recs__info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  margin-top: var(--space-12);
}

@media (min-width: 768px) {
  .config-recs__info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.config-recs__info-card {
  background-color: var(--color-surface-container);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(192, 200, 204, 0.05);
}

.config-recs__info-icon {
  color: var(--color-primary-container);
  font-size: 30px;
  margin-bottom: var(--space-4);
}

.config-recs__info-title {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.config-recs__info-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
</style>
