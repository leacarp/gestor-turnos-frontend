<script setup lang="ts">
import { onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppBottomNav from '@/components/AppBottomNav.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.restoreSession()
})
</script>

<template>
  <div class="dashboard-layout">
    <AppSidebar class="dashboard-layout__sidebar" />
    <main class="dashboard-layout__main">
      <router-view />
    </main>
    <AppBottomNav />
  </div>
</template>

<style scoped>
/**
 * Mobile-first: por defecto el contenido ocupa todo el ancho y la
 * navegación es la barra inferior. Recién en >= 1024px aparece el
 * sidebar fijo y el main se corre para no quedar debajo.
 */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

/* Selector descendiente a propósito: AppSidebar declara `display: flex` en su
 * propio bloque scoped y, con igual especificidad, quién gana dependería del
 * orden en que Vite emite los estilos. Con el `.dashboard-layout >` adelante
 * el resultado es siempre el mismo. */
.dashboard-layout > .dashboard-layout__sidebar {
  display: none;
}

.dashboard-layout__main {
  flex: 1;
  /* min-width: 0 evita que un hijo ancho (una tabla, un texto largo sin
   * cortes) estire el flex item y genere scroll horizontal en toda la app. */
  min-width: 0;
  min-height: 100vh;
  /* Colchón para que el último elemento de la página no quede tapado por
   * la bottom nav. En escritorio el token vale 0. */
  padding-bottom: var(--bottom-nav-offset);
}

@media (min-width: 1024px) {
  .dashboard-layout > .dashboard-layout__sidebar {
    display: flex;
    width: var(--sidebar-width, 260px);
    flex-shrink: 0;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
  }

  .dashboard-layout__main {
    margin-left: var(--sidebar-width, 260px);
  }
}
</style>
