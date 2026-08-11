<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { getInitials } from '@/utils/initials'

/**
 * Navegación inferior del dashboard para celular y tablet (< 1024px).
 * De 1024px para arriba el layout la oculta y muestra el AppSidebar.
 *
 * Los cuatro destinos de uso diario van en la barra; Perfil, Configuración
 * y Salir viven en el sheet de "Más" para no pasar de cinco slots, que es
 * donde una barra inferior deja de ser tocable con el pulgar.
 */

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { name: 'Agenda', icon: 'calendar_today', path: '/agenda' },
  { name: 'Clientes', icon: 'group', path: '/clientes' },
  { name: 'Servicios', icon: 'inventory_2', path: '/services' },
  { name: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
]

const moreItems = [
  { name: 'Perfil', icon: 'person', path: '/perfil' },
  { name: 'Configuración', icon: 'settings', path: '/configuracion' },
]

const isMoreOpen = ref(false)

function isActive(path: string) {
  return route.path.startsWith(path)
}

/** El botón "Más" se marca activo cuando la ruta actual vive adentro del sheet. */
const isMoreActive = () => moreItems.some((item) => isActive(item.path))

function goTo(path: string) {
  isMoreOpen.value = false
  router.push(path)
}

function handleLogout() {
  isMoreOpen.value = false
  router.push('/login')
}

// Con el sheet abierto el fondo no debe scrollear: en iOS el scroll se
// "filtra" al body y el usuario pierde de vista el panel.
watch(isMoreOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

// El sheet vive teleportado al body: si el componente se destruye con el
// sheet abierto, el lock de scroll quedaría puesto para siempre.
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- Sheet "Más" -->
  <Teleport to="body">
    <Transition name="app-bottom-nav-fade">
      <div v-if="isMoreOpen" class="app-bottom-nav__backdrop" @click="isMoreOpen = false" />
    </Transition>

    <Transition name="app-bottom-nav-slide">
      <div
        v-if="isMoreOpen"
        class="app-bottom-nav__sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Más opciones"
      >
        <div class="app-bottom-nav__sheet-handle" aria-hidden="true" />

        <div class="app-bottom-nav__user">
          <div class="app-bottom-nav__user-avatar">
            <span class="app-bottom-nav__user-initials">
              {{ getInitials(authStore.user?.name) }}
            </span>
          </div>
          <div class="app-bottom-nav__user-info">
            <span class="app-bottom-nav__user-name">{{ authStore.user?.name ?? '—' }}</span>
            <span class="app-bottom-nav__user-role">Proveedor</span>
          </div>
        </div>

        <nav class="app-bottom-nav__sheet-nav">
          <button
            v-for="item in moreItems"
            :key="item.name"
            class="app-bottom-nav__sheet-item"
            :class="{ 'app-bottom-nav__sheet-item--active': isActive(item.path) }"
            type="button"
            @click="goTo(item.path)"
          >
            <span class="material-symbols-outlined app-bottom-nav__sheet-icon">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </button>

          <button
            class="app-bottom-nav__sheet-item app-bottom-nav__sheet-item--logout"
            type="button"
            @click="handleLogout"
          >
            <span class="material-symbols-outlined app-bottom-nav__sheet-icon">logout</span>
            <span>Salir</span>
          </button>
        </nav>
      </div>
    </Transition>
  </Teleport>

  <!-- Barra inferior -->
  <nav class="app-bottom-nav" aria-label="Navegación principal">
    <router-link
      v-for="item in navItems"
      :key="item.name"
      :to="item.path"
      class="app-bottom-nav__item"
      :class="{ 'app-bottom-nav__item--active': isActive(item.path) }"
      :aria-current="isActive(item.path) ? 'page' : undefined"
    >
      <span
        class="material-symbols-outlined app-bottom-nav__icon"
        :style="isActive(item.path) ? 'font-variation-settings: \'FILL\' 1;' : ''"
      >
        {{ item.icon }}
      </span>
      <span class="app-bottom-nav__label">{{ item.name }}</span>
    </router-link>

    <button
      class="app-bottom-nav__item"
      :class="{ 'app-bottom-nav__item--active': isMoreActive() || isMoreOpen }"
      type="button"
      :aria-expanded="isMoreOpen"
      aria-label="Más opciones"
      @click="isMoreOpen = !isMoreOpen"
    >
      <span class="material-symbols-outlined app-bottom-nav__icon">
        {{ isMoreOpen ? 'close' : 'more_horiz' }}
      </span>
      <span class="app-bottom-nav__label">Más</span>
    </button>
  </nav>
</template>

<style scoped>
.app-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: stretch;
  background-color: var(--color-surface-container-lowest);
  border-top: 1px solid var(--color-border);
  /* El safe-area evita que la barra quede debajo del indicador del iPhone */
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.06);
}

.app-bottom-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  /* min-height asegura el área táctil de 44px aun con la escala al 80% */
  min-height: var(--tap-target-min);
  height: var(--bottom-nav-height);
  padding: var(--space-1);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-family: var(--font-family-base);
  cursor: pointer;
  transition: color var(--transition-fast);
  /* Sin esto Android dibuja un flash gris en cada tap */
  -webkit-tap-highlight-color: transparent;
}

.app-bottom-nav__item--active {
  color: var(--color-primary);
}

.app-bottom-nav__icon {
  font-size: 22px;
  line-height: 1;
}

.app-bottom-nav__label {
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
  white-space: nowrap;
}

.app-bottom-nav__item--active .app-bottom-nav__label {
  font-weight: var(--font-weight-bold);
}

/* ── Sheet "Más" ─────────────────────────────────────────── */

.app-bottom-nav__backdrop {
  position: fixed;
  inset: 0;
  z-index: 110;
  background: rgba(25, 27, 35, 0.45);
}

.app-bottom-nav__sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 120;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background-color: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--space-3) var(--space-4)
    calc(var(--space-4) + var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px));
  box-shadow: var(--shadow-lg);
}

.app-bottom-nav__sheet-handle {
  width: 36px;
  height: 4px;
  margin: 0 auto var(--space-2);
  border-radius: var(--radius-full);
  background-color: var(--color-outline-variant);
}

.app-bottom-nav__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-2xl);
}

.app-bottom-nav__user-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-fixed);
}

.app-bottom-nav__user-initials {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  line-height: 1;
}

.app-bottom-nav__user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-bottom-nav__user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-bottom-nav__user-role {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
}

.app-bottom-nav__sheet-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.app-bottom-nav__sheet-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  min-height: var(--tap-target-min);
  padding: var(--space-3) var(--space-4);
  border: none;
  background: transparent;
  border-radius: var(--radius-2xl);
  color: var(--color-text-secondary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.app-bottom-nav__sheet-item:active {
  background-color: var(--color-surface-container-low);
}

.app-bottom-nav__sheet-item--active {
  background-color: var(--color-surface-container-low);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.app-bottom-nav__sheet-item--logout {
  color: var(--color-error);
}

.app-bottom-nav__sheet-icon {
  font-size: 22px;
}

/* ── Transiciones ────────────────────────────────────────── */

.app-bottom-nav-fade-enter-active,
.app-bottom-nav-fade-leave-active {
  transition: opacity var(--transition-base);
}

.app-bottom-nav-fade-enter-from,
.app-bottom-nav-fade-leave-to {
  opacity: 0;
}

.app-bottom-nav-slide-enter-active,
.app-bottom-nav-slide-leave-active {
  transition: transform var(--transition-base);
}

.app-bottom-nav-slide-enter-from,
.app-bottom-nav-slide-leave-to {
  transform: translateY(100%);
}

/* De 1024px para arriba manda el sidebar. También escondemos el sheet por
 * si el usuario agranda la ventana con el panel abierto. */
@media (min-width: 1024px) {
  .app-bottom-nav,
  .app-bottom-nav__backdrop,
  .app-bottom-nav__sheet {
    display: none;
  }
}
</style>
