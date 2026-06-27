<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppInput from '@/components/AppInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppButton from '@/components/AppButton.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { userService } from '@/services/userService'

const authStore = useAuthStore()

// ── Booking link ────────────────────────────────────────────
const bookingLink = computed(() => {
  const id = authStore.user?.id
  if (!id) return ''
  return `${window.location.origin}/booking/${id}`
})

const linkCopied = ref(false)

async function copyBookingLink() {
  if (!bookingLink.value) return
  await navigator.clipboard.writeText(bookingLink.value)
  linkCopied.value = true
  setTimeout(() => { linkCopied.value = false }, 2000)
}

// ── Form state ───────────────────────────────────────────────
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')

// Campos del usuario
const name = ref('')
const email = ref('')
const phone = ref('')

// Campos del proveedor
const serviceType = ref('')
const address = ref('')
const publicInfo = ref('')
const minimumAdvance = ref<number | ''>('')
const socialMedia = ref<{ platform: string; url: string }[]>([])

// Estado original para detectar cambios
const original = ref({
  name: '', email: '', phone: '',
  serviceType: '', address: '', publicInfo: '',
  minimumAdvance: '' as number | '',
  socialMedia: [] as { platform: string; url: string }[],
})

// ── Category / serviceType con opción "otro" ─────────────────
const previousServiceType = ref('')
const showCustomCategoryModal = ref(false)
const customCategoryValue = ref('')
const logoInput = ref<HTMLInputElement | null>(null)

const categoryOptions = ref([
  { value: 'estetica', label: 'Estética' },
  { value: 'barberia', label: 'Barbería' },
  { value: 'salud', label: 'Salud' },
  { value: 'bienestar', label: 'Bienestar' },
  { value: 'otro', label: 'Otro' },
])

function onCategoryChange(newValue: string | number) {
  if (newValue === 'otro') {
    showCustomCategoryModal.value = true
  } else {
    previousServiceType.value = String(newValue)
    serviceType.value = String(newValue)
  }
}

function saveCustomCategory() {
  if (customCategoryValue.value.trim()) {
    const newVal = customCategoryValue.value.trim().toLowerCase().replace(/\s+/g, '-')
    if (!categoryOptions.value.find(opt => opt.value === newVal)) {
      categoryOptions.value.splice(categoryOptions.value.length - 1, 0, {
        value: newVal,
        label: customCategoryValue.value.trim(),
      })
    }
    serviceType.value = newVal
    previousServiceType.value = newVal
  } else {
    serviceType.value = previousServiceType.value
  }
  showCustomCategoryModal.value = false
  customCategoryValue.value = ''
}

function cancelCustomCategory() {
  serviceType.value = previousServiceType.value
  showCustomCategoryModal.value = false
  customCategoryValue.value = ''
}

// ── Social media helpers ─────────────────────────────────────
const socialPlatformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'otro', label: 'Otro' },
]

function addSocialMedia() {
  socialMedia.value.push({ platform: 'instagram', url: '' })
}

function removeSocialMedia(index: number) {
  socialMedia.value.splice(index, 1)
}

// ── Logo upload ──────────────────────────────────────────────
function triggerLogoUpload() {
  logoInput.value?.click()
}

function handleLogoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    console.log('Logo seleccionado:', target.files[0])
    // TODO: upload logo
  }
}

// ── Porcentaje de perfil completado ─────────────────────────
const profileFields = computed(() => [
  { label: 'Nombre del negocio', filled: !!name.value.trim() },
  { label: 'Email de contacto', filled: !!email.value.trim() },
  { label: 'Teléfono', filled: !!phone.value.trim() },
  { label: 'Rubro', filled: !!serviceType.value },
  { label: 'Dirección', filled: !!address.value.trim() },
  { label: 'Descripción pública', filled: !!publicInfo.value.trim() },
  { label: 'Anticipación mínima', filled: minimumAdvance.value !== '' && minimumAdvance.value !== null },
  { label: 'Redes sociales', filled: socialMedia.value.some(s => s.url.trim()) },
])

const profileCompletion = computed(() => {
  const filled = profileFields.value.filter(f => f.filled).length
  return Math.round((filled / profileFields.value.length) * 100)
})

const missingFields = computed(() => profileFields.value.filter(f => !f.filled))

// ── isDirty: habilita el botón Guardar ──────────────────────
const isDirty = computed(() => {
  if (name.value !== original.value.name) return true
  if (email.value !== original.value.email) return true
  if (phone.value !== original.value.phone) return true
  if (serviceType.value !== original.value.serviceType) return true
  if (address.value !== original.value.address) return true
  if (publicInfo.value !== original.value.publicInfo) return true
  if (minimumAdvance.value !== original.value.minimumAdvance) return true
  if (JSON.stringify(socialMedia.value) !== JSON.stringify(original.value.socialMedia)) return true
  return false
})

// ── Carga inicial ────────────────────────────────────────────
function populateForm(user: Awaited<ReturnType<typeof userService.getMe>>['data']) {
  name.value = user.name ?? ''
  email.value = user.email ?? ''
  phone.value = user.phone ?? ''
  serviceType.value = user.providerData?.serviceType ?? ''
  address.value = user.providerData?.address ?? ''
  publicInfo.value = user.providerData?.publicInfo ?? ''
  minimumAdvance.value = user.providerData?.minimumAdvance ?? ''
  socialMedia.value = user.providerData?.socialMedia
    ? user.providerData.socialMedia.map(s => ({ ...s }))
    : []

  // Si el serviceType no está en las opciones predefinidas, lo agrega
  if (serviceType.value && !categoryOptions.value.find(o => o.value === serviceType.value)) {
    categoryOptions.value.splice(categoryOptions.value.length - 1, 0, {
      value: serviceType.value,
      label: serviceType.value.charAt(0).toUpperCase() + serviceType.value.slice(1),
    })
  }

  previousServiceType.value = serviceType.value

  // Snapshot del estado original
  original.value = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    serviceType: serviceType.value,
    address: address.value,
    publicInfo: publicInfo.value,
    minimumAdvance: minimumAdvance.value,
    socialMedia: socialMedia.value.map(s => ({ ...s })),
  }
}

onMounted(async () => {
  try {
    const { data } = await userService.getMe()
    populateForm(data)
  } catch {
    errorMsg.value = 'No se pudo cargar el perfil.'
  } finally {
    loading.value = false
  }
})

// ── Guardar cambios ──────────────────────────────────────────
function discardChanges() {
  name.value = original.value.name
  email.value = original.value.email
  phone.value = original.value.phone
  serviceType.value = original.value.serviceType
  address.value = original.value.address
  publicInfo.value = original.value.publicInfo
  minimumAdvance.value = original.value.minimumAdvance
  socialMedia.value = original.value.socialMedia.map(s => ({ ...s }))
}

async function handleSubmit() {
  if (!isDirty.value) return
  saving.value = true
  errorMsg.value = ''
  try {
    const payload: Parameters<typeof userService.updateMe>[0] = {}

    if (name.value !== original.value.name) payload.name = name.value
    if (email.value !== original.value.email) payload.email = email.value
    if (phone.value !== original.value.phone) payload.phone = phone.value

    const providerChanged =
      serviceType.value !== original.value.serviceType ||
      address.value !== original.value.address ||
      publicInfo.value !== original.value.publicInfo ||
      minimumAdvance.value !== original.value.minimumAdvance ||
      JSON.stringify(socialMedia.value) !== JSON.stringify(original.value.socialMedia)

    if (providerChanged) {
      payload.providerData = {}
      if (serviceType.value !== original.value.serviceType) payload.providerData.serviceType = serviceType.value
      if (address.value !== original.value.address) payload.providerData.address = address.value
      if (publicInfo.value !== original.value.publicInfo) payload.providerData.publicInfo = publicInfo.value
      if (minimumAdvance.value !== original.value.minimumAdvance)
        payload.providerData.minimumAdvance = minimumAdvance.value === '' ? undefined : Number(minimumAdvance.value)
      if (JSON.stringify(socialMedia.value) !== JSON.stringify(original.value.socialMedia))
        payload.providerData.socialMedia = socialMedia.value.filter(s => s.url.trim())
    }

    const { data } = await userService.updateMe(payload)
    populateForm(data)
  } catch {
    errorMsg.value = 'Error al guardar los cambios. Intenta nuevamente.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="provider-view">
    <header class="provider-view__header">
      <div class="provider-view__header-content">
        <div class="provider-view__title-group">
          <h1 class="provider-view__title">Perfil del Negocio</h1>
          <p class="provider-view__subtitle">Actualiza la información pública y de contacto de tu establecimiento.</p>
        </div>

        <div class="provider-view__booking-link-block">
          <p class="provider-view__booking-link-label">Tu link de reservas</p>
          <div class="provider-view__booking-link-row">
            <span class="provider-view__booking-link-url">{{ bookingLink || 'Cargando…' }}</span>
            <AppButton
              type="button"
              variant="outline"
              :iconLeft="linkCopied ? 'check' : 'content_copy'"
              :disabled="!bookingLink"
              @click="copyBookingLink"
            >{{ linkCopied ? 'Copiado' : 'Copiar' }}</AppButton>
          </div>
        </div>
      </div>
    </header>

    <section class="provider-view__content-section">
      <!-- Loading skeleton -->
      <div v-if="loading" class="provider-view__loading">
        <div class="provider-view__skeleton provider-view__skeleton--card"></div>
      </div>

      <div v-else class="provider-view__content">
        <!-- Error global -->
        <div v-if="errorMsg" class="provider-view__error">
          <span class="material-symbols-outlined">error</span>
          {{ errorMsg }}
        </div>

        <div class="provider-view__card">
          <div class="provider-view__card-header">
            <div class="provider-view__card-icon">
              <span class="material-symbols-outlined">storefront</span>
            </div>
            <div class="provider-view__card-title-group">
              <h3 class="provider-view__card-title">Datos del negocio</h3>
              <p class="provider-view__card-subtitle">Esta información será visible para tus clientes.</p>
            </div>
            <div style="margin-left: auto;">
              <input type="file" ref="logoInput" style="display: none;" accept="image/*" @change="handleLogoUpload" />
              <AppButton type="button" variant="outline" iconLeft="upload" @click="triggerLogoUpload">Subir logo</AppButton>
            </div>
          </div>

          <form class="provider-view__form" @submit.prevent="handleSubmit">

            <!-- Sección: Información de contacto -->
            <div class="provider-view__section">
              <h4 class="provider-view__section-title">
                <span class="material-symbols-outlined">person</span>
                Información de contacto
              </h4>
              <div class="provider-view__form-grid">
                <AppInput v-model="name" label="Nombre del negocio" />
                <AppSelect
                  :modelValue="serviceType"
                  @update:modelValue="onCategoryChange"
                  label="Rubro"
                  :options="categoryOptions"
                />
                <AppInput v-model="email" label="Email de contacto" type="email" />
                <AppInput v-model="phone" label="Teléfono" type="tel" />
              </div>
            </div>

            <!-- Sección: Ubicación y operación -->
            <div class="provider-view__section">
              <h4 class="provider-view__section-title">
                <span class="material-symbols-outlined">location_on</span>
                Ubicación y operación
              </h4>
              <div class="provider-view__form-grid">
                <div class="provider-view__form-grid--full">
                  <AppInput v-model="address" label="Dirección" placeholder="Ej: Av. Santa Fe 1234, CABA" iconLeft="location_on" />
                </div>
                <AppInput
                  v-model="minimumAdvance"
                  label="Anticipación mínima para reservas"
                  type="number"
                  placeholder="Ej: 60"
                  iconLeft="monetization_on"
                />
              </div>
            </div>

            <!-- Sección: Descripción pública -->
            <div class="provider-view__section">
              <h4 class="provider-view__section-title">
                <span class="material-symbols-outlined">description</span>
                Descripción pública
              </h4>
              <textarea
                v-model="publicInfo"
                class="provider-view__textarea"
                placeholder="Contá a tus clientes quiénes son, qué hacen y qué los diferencia…"
                rows="4"
              ></textarea>
            </div>

            <!-- Sección: Redes sociales -->
            <div class="provider-view__section">
              <div class="provider-view__section-header">
                <h4 class="provider-view__section-title">
                  <span class="material-symbols-outlined">share</span>
                  Redes sociales
                </h4>
                <AppButton type="button" variant="outline" iconLeft="add" @click="addSocialMedia">Agregar red</AppButton>
              </div>

              <div v-if="socialMedia.length === 0" class="provider-view__social-empty">
                <span class="material-symbols-outlined">link_off</span>
                <p>No hay redes sociales agregadas todavía.</p>
              </div>

              <div v-else class="provider-view__social-list">
                <div
                  v-for="(item, index) in socialMedia"
                  :key="index"
                  class="provider-view__social-row"
                >
                  <AppSelect
                    :modelValue="item.platform"
                    @update:modelValue="val => item.platform = String(val)"
                    :options="socialPlatformOptions"
                    label="Plataforma"
                  />
                  <AppInput
                    v-model="item.url"
                    label="URL o usuario"
                    :placeholder="item.platform === 'whatsapp' ? 'Ej: +5491112345678' : 'Ej: https://instagram.com/tu-negocio'"
                    iconLeft="link"
                  />
                  <button type="button" class="provider-view__social-remove" @click="removeSocialMedia(index)" title="Eliminar">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Estado del perfil -->
            <div class="provider-view__status-section">
              <div class="provider-view__status">
                <span class="provider-view__status-dot"></span>
                <span class="provider-view__status-text">Perfil verificado y activo</span>
              </div>
              <p class="provider-view__status-desc">
                Tu perfil ha sido verificado. Cualquier cambio importante en el rubro puede requerir una nueva validación.
              </p>
            </div>

            <!-- Acciones -->
            <div class="provider-view__actions">
              <AppButton type="button" variant="outline" :disabled="!isDirty || saving" @click="discardChanges">
                Descartar cambios
              </AppButton>
              <AppButton type="submit" variant="gradient" :disabled="!isDirty || saving">
                <span v-if="saving" class="provider-view__spinner"></span>
                {{ saving ? 'Guardando…' : 'Guardar cambios' }}
              </AppButton>
            </div>
          </form>
        </div>

        <!-- Bento cards -->
        <div class="provider-view__bento">
          <div class="provider-view__bento-card provider-view__bento-card--primary">
            <div class="provider-view__bento-content">
              <h4 class="provider-view__bento-title">Mejora tu visibilidad</h4>
              <p class="provider-view__bento-desc">Completa la galería de fotos para que tus clientes puedan ver tus mejores trabajos.</p>
              <button class="provider-view__bento-btn" type="button">
                Subir fotos <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div class="provider-view__bento-image">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoVuP5G1-8OJ3AMdAp4e3KCeeyB9oKLMVKrKvcAMovUjN80m6ZDS7Uey8jYur9ljWLS03q3wfqKfya2ulrJS6MOKH_cp3N3SiJv7sqKPMi-L2X65sFiUC7zSD3GDIKOk-5cz3WAKTgHDaqiEMgOdKtvPb8e-CNLDNoPL3gWA5hIXJHtQKTMDAaRbuko5JattPTnPe0r8asZYth3gBlhWUipy1aq88SbcgDkzQTzH4ughrhu0VmMqMcAQcpOOI7bR5zPArAOEPzQ_4" alt="Decoration" />
            </div>
          </div>

          <div class="provider-view__bento-card provider-view__bento-card--secondary">
            <span class="provider-view__progress-value">{{ profileCompletion }}%</span>
            <p class="provider-view__progress-label">Perfil completado</p>
            <div class="provider-view__progress-bar">
              <div class="provider-view__progress-fill" :style="{ width: profileCompletion + '%' }"></div>
            </div>
            <ul v-if="missingFields.length" class="provider-view__missing-list">
              <li v-for="field in missingFields" :key="field.label" class="provider-view__missing-item">
                <span class="material-symbols-outlined">radio_button_unchecked</span>
                {{ field.label }}
              </li>
            </ul>
            <p v-else class="provider-view__missing-complete">
              <span class="material-symbols-outlined">check_circle</span>
              ¡Perfil completo!
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Rubro Personalizado -->
    <div v-if="showCustomCategoryModal" class="provider-view__modal-overlay" @click.self="cancelCustomCategory">
      <div class="provider-view__modal">
        <h3 class="provider-view__modal-title">Rubro personalizado</h3>
        <p class="provider-view__modal-desc">Ingresa el rubro al que pertenece tu negocio.</p>
        <div class="provider-view__modal-body">
          <AppInput v-model="customCategoryValue" placeholder="Ej: Peluquería canina" @keyup.enter="saveCustomCategory" />
        </div>
        <div class="provider-view__modal-actions">
          <AppButton variant="outline" @click="cancelCustomCategory">Cancelar</AppButton>
          <AppButton variant="solid" @click="saveCustomCategory">Aplicar</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.provider-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-surface);
  font-family: var(--font-family-base);
}

/* ── Header ────────────────────────────────────────────────── */
.provider-view__header {
  padding: var(--space-12) var(--space-12) var(--space-8);
}

.provider-view__header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .provider-view__header-content {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.provider-view__title-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.provider-view__title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
  margin: 0;
}

.provider-view__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* ── Content ────────────────────────────────────────────────── */
.provider-view__content-section {
  padding: 0 var(--space-12) var(--space-16);
}

.provider-view__content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

/* ── Loading ────────────────────────────────────────────────── */
.provider-view__loading {
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
}

.provider-view__skeleton {
  border-radius: var(--radius-xl);
  background: linear-gradient(90deg, var(--color-surface-container-low) 25%, var(--color-surface-container) 50%, var(--color-surface-container-low) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.provider-view__skeleton--card {
  height: 480px;
  width: 100%;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Error ────────────────────────────────────────────────── */
.provider-view__error {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  background-color: #fee2e2;
  color: #dc2626;
  font-size: var(--font-size-sm);
}

/* ── Card ────────────────────────────────────────────────── */
.provider-view__card {
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
}

.provider-view__card-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.provider-view__card-icon {
  width: 54px;
  height: 54px;
  border-radius: var(--radius-xl);
  background-color: var(--color-primary-fixed);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.provider-view__card-icon .material-symbols-outlined {
  font-size: 30px;
}

.provider-view__card-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 0;
}

.provider-view__card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--space-2) 0 0 0;
}

/* ── Form ────────────────────────────────────────────────── */
.provider-view__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.provider-view__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-surface-container);
}

.provider-view__section:first-of-type {
  padding-top: 0;
  border-top: none;
}

.provider-view__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.provider-view__section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.provider-view__section-title .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-primary);
}

.provider-view__form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6) var(--space-8);
}

@media (min-width: 768px) {
  .provider-view__form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.provider-view__form-grid--full {
  grid-column: 1 / -1;
}

/* ── Textarea ────────────────────────────────────────────── */
.provider-view__textarea {
  width: 100%;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-surface-container);
  background-color: var(--color-surface-container-low);
  color: var(--color-text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  resize: vertical;
  min-height: 100px;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}

.provider-view__textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.provider-view__textarea::placeholder {
  color: var(--color-text-secondary);
}

/* ── Social media ────────────────────────────────────────── */
.provider-view__social-empty {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface-container-low);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.provider-view__social-empty .material-symbols-outlined {
  font-size: 20px;
}

.provider-view__social-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.provider-view__social-row {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: var(--space-4);
  align-items: end;
}

@media (max-width: 640px) {
  .provider-view__social-row {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
  }

  .provider-view__social-row > :first-child {
    grid-column: 1;
  }

  .provider-view__social-row > :nth-child(2) {
    grid-column: 1;
  }

  .provider-view__social-remove {
    grid-row: 1 / 3;
    grid-column: 2;
    align-self: center;
  }
}

.provider-view__social-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-surface-container);
  background-color: var(--color-surface-container-low);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  margin-bottom: 2px;
}

.provider-view__social-remove:hover {
  background-color: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

.provider-view__social-remove .material-symbols-outlined {
  font-size: 18px;
}

/* ── Status ────────────────────────────────────────────────── */
.provider-view__status-section {
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-surface-container);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.provider-view__status {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.provider-view__status-dot {
  display: flex;
  height: 12px;
  width: 12px;
  border-radius: var(--radius-full);
  background-color: #22c55e;
  flex-shrink: 0;
}

.provider-view__status-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.provider-view__status-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0;
}

/* ── Actions ────────────────────────────────────────────────── */
.provider-view__actions {
  padding-top: var(--space-6);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-4);
  border-top: 1px solid var(--color-surface-container);
}

/* ── Spinner ────────────────────────────────────────────────── */
.provider-view__spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: var(--space-2);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Bento ────────────────────────────────────────────────── */
.provider-view__bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .provider-view__bento {
    grid-template-columns: repeat(3, 1fr);
  }

  .provider-view__bento-card--primary {
    grid-column: span 2;
  }
}

.provider-view__bento-card {
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  display: flex;
}

.provider-view__bento-card--primary {
  background: linear-gradient(to bottom right, rgba(210, 224, 253, 0.3), var(--color-surface-container));
  align-items: center;
  justify-content: space-between;
}

.provider-view__bento-content {
  max-width: 60%;
}

.provider-view__bento-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
}

.provider-view__bento-desc {
  font-size: var(--font-size-sm);
  color: var(--color-on-secondary-container);
}

.provider-view__bento-btn {
  margin-top: var(--space-4);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.provider-view__bento-btn:hover .material-symbols-outlined {
  transform: translateX(4px);
}

.provider-view__bento-btn .material-symbols-outlined {
  font-size: var(--font-size-sm);
  transition: transform var(--transition-fast);
}

.provider-view__bento-image {
  display: none;
}

@media (min-width: 640px) {
  .provider-view__bento-image {
    display: block;
  }

  .provider-view__bento-image img {
    width: 96px;
    opacity: 0.6;
  }
}

.provider-view__bento-card--secondary {
  background-color: var(--color-surface-container-highest);
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.provider-view__progress-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-1);
}

.provider-view__progress-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.provider-view__progress-bar {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  height: 8px;
  border-radius: var(--radius-full);
  margin-top: var(--space-4);
  overflow: hidden;
}

.provider-view__progress-fill {
  background-color: var(--color-primary);
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.provider-view__missing-list {
  list-style: none;
  padding: 0;
  margin: var(--space-4) 0 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: left;
}

.provider-view__missing-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.provider-view__missing-item .material-symbols-outlined {
  font-size: 14px;
  color: var(--color-text-secondary);
  opacity: 0.6;
}

.provider-view__missing-complete {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin: var(--space-4) 0 0 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: #22c55e;
}

.provider-view__missing-complete .material-symbols-outlined {
  font-size: 18px;
}

/* ── Booking link ────────────────────────────────────────── */
.provider-view__booking-link-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.provider-view__booking-link-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin: 0;
}

.provider-view__booking-link-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background-color: var(--color-surface-container-low);
  border: 1px solid var(--color-surface-container);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-3);
}

.provider-view__booking-link-url {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-family: var(--font-family-mono, monospace);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

/* ── Modal ────────────────────────────────────────────────── */
.provider-view__modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.provider-view__modal {
  background: var(--color-surface-container-lowest, #fff);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
}

.provider-view__modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.provider-view__modal-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}

.provider-view__modal-body {
  margin-bottom: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.provider-view__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: auto;
}
</style>
