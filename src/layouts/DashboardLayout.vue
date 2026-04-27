<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template>
  <div class="dashboard-layout">
    <AppSidebar class="dashboard-layout__sidebar" />
    <main class="dashboard-layout__main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.dashboard-layout__sidebar {
  width: var(--sidebar-width, 260px);
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 50;
}

.dashboard-layout__main {
  flex: 1;
  margin-left: var(--sidebar-width, 260px);
  min-height: 100vh;
}
</style>
