<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'Servicios', path: '/configuracion/servicios' },
  { name: 'Horarios', path: '/configuracion/horarios' },
  { name: 'Recordatorios', path: '/configuracion/recordatorios' },
  { name: 'Pagos', path: '/configuracion/pagos' }
]
</script>

<template>
  <div class="config-layout">
    <!-- TopNavBar Shell -->
    <header class="config-header">
      <div class="config-header__left">
        <nav class="config-nav">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="config-nav__link"
            active-class="config-nav__link--active"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>

      <div class="config-header__right">
        <div class="config-search">
          <span class="material-symbols-outlined config-search__icon">search</span>
          <input class="config-search__input" placeholder="Buscar..." type="text" />
        </div>
        
        <div class="config-actions">
          <button class="config-action-btn">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <button class="config-action-btn">
            <span class="material-symbols-outlined">help_outline</span>
          </button>
          <div class="config-user-avatar">
            <img src="https://i.pravatar.cc/150?u=aero" alt="User Avatar" />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="config-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.config-layout {
  min-height: 100vh;
  background-color: var(--color-surface);
  position: relative;
}

.config-header {
  position: sticky;
  top: 0;
  height: var(--header-height, 64px);
  z-index: 40;
  background-color: rgba(249, 249, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  border-bottom: 1px solid rgba(3, 7, 8, 0.2); /* outline-variant at 20% */
}

.config-header__left {
  display: flex;
  align-items: center;
  height: 100%;
}

.config-nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  height: 100%;
}

.config-nav__link {
  color: var(--color-text-disabled);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: color var(--transition-fast);
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 var(--space-1);
  border-bottom: 2px solid transparent;
}

.config-nav__link:hover {
  color: var(--color-primary);
}

.config-nav__link--active {
  color: var(--color-primary-container);
  border-bottom-color: var(--color-primary-container);
  font-weight: var(--font-weight-bold);
}

.config-header__right {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.config-search {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-4);
  width: 256px; /* 64 * 4 */
}

.config-search__icon {
  color: var(--color-text-disabled);
  font-size: 20px;
}

.config-search__input {
  background: transparent;
  border: none;
  outline: none;
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin-left: var(--space-2);
  width: 100%;
  font-family: inherit;
}

.config-search__input:focus {
  outline: none;
  box-shadow: none;
}

.config-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.config-action-btn {
  background: transparent;
  border: none;
  color: var(--color-text-disabled);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.config-action-btn:hover {
  color: var(--color-primary);
  background-color: var(--color-surface-container);
}

.config-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 1px solid rgba(192, 200, 204, 0.2);
  background-color: var(--color-surface-container-high);
}

.config-user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.config-main {
  padding: var(--space-8) var(--space-8) var(--space-12);
  min-height: calc(100vh - var(--header-height, 64px));
}
</style>
