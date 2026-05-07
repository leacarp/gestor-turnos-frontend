<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { name: 'Perfil', icon: 'person', path: '/perfil' },
  { name: 'Agenda', icon: 'calendar_today', path: '/agenda' },
  { name: 'Servicios', icon: 'inventory_2', path: '/services' },
  { name: 'Clientes', icon: 'group', path: '/clientes' },
  { name: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
  { name: 'Configuración', icon: 'settings', path: '/configuracion' },
]

function isActive(path: string) {
  if (path === '/') {
    return route.path === '/' || route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

function handleLogout() {
  router.push('/login')
}
</script>

<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__header">
      <div class="app-sidebar__logo">
        <div class="app-sidebar__logo-icon">
          <img src="/logo.png" alt="Sloty Logo" />
        </div>
        <div class="app-sidebar__logo-text">
          <span class="app-sidebar__logo-title">Sloty</span>
        </div>
      </div>
    </div>

    <nav class="app-sidebar__nav">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="app-sidebar__nav-item"
        :class="{ 'app-sidebar__nav-item--active': isActive(item.path) }"
      >
        <span 
          class="material-symbols-outlined app-sidebar__nav-icon"
          :style="isActive(item.path) ? 'font-variation-settings: \'FILL\' 1;' : ''"
        >
          {{ item.icon }}
        </span>
        <span class="app-sidebar__nav-label">{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="app-sidebar__footer">
      <div class="app-sidebar__user">
        <div class="app-sidebar__user-avatar">
          <img src="https://i.pravatar.cc/150?u=aero" alt="User Avatar" />
        </div>
        <div class="app-sidebar__user-info">
          <span class="app-sidebar__user-name">Marcus V. Aero</span>
          <span class="app-sidebar__user-role">Enterprise Admin</span>
        </div>
      </div>

      <button class="app-sidebar__logout-btn" @click="handleLogout">
        <span class="material-symbols-outlined">logout</span>
        <span class="app-sidebar__logout-label">Salir</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface-container-lowest);
  border-right: 1px solid var(--color-border);
  padding: var(--space-6) var(--space-4);
  gap: var(--space-6);
  font-family: var(--font-family-base);
}

.app-sidebar__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: 0 var(--space-2);
}

.app-sidebar__logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.app-sidebar__logo-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.app-sidebar__logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-sidebar__logo-text {
  display: flex;
  flex-direction: column;
}

.app-sidebar__logo-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: var(--line-height-tight);
}

.app-sidebar__new-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--gradient-primary);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-primary);
}

.app-sidebar__new-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px 0 rgba(0, 50, 86, 0.3);
}

.app-sidebar__new-btn:active {
  transform: scale(0.98);
}

.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.app-sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-2xl);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.app-sidebar__nav-item:hover {
  background-color: var(--color-surface-container-low);
  color: var(--color-text-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.app-sidebar__nav-item--active {
  background-color: var(--color-surface-container-low);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.app-sidebar__nav-icon {
  font-size: 22px;
}

.app-sidebar__nav-label {
  font-size: var(--font-size-sm);
}

.app-sidebar__footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-top: var(--space-4);
}

.app-sidebar__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background-color: var(--color-surface-container-low);
  border-radius: var(--radius-2xl);
}

.app-sidebar__user-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  overflow: hidden;
  flex-shrink: 0;
}

.app-sidebar__user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-sidebar__user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-sidebar__user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-sidebar__user-role {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
}

.app-sidebar__logout-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-2xl);
  transition: all var(--transition-fast);
  width: 100%;
  text-align: left;
}

.app-sidebar__logout-btn:hover {
  background-color: var(--color-surface-container-low);
  color: var(--color-text-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.app-sidebar__logout-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
</style>
