<script setup lang="ts">
</script>

<template>
  <header class="top-app-bar">
    <div class="top-app-bar__actions">
      <button type="button" class="top-app-bar__btn" aria-label="Ayuda">
        <span class="material-symbols-outlined">help_outline</span>
      </button>
      <button type="button" class="top-app-bar__btn" aria-label="Notificaciones">
        <span class="material-symbols-outlined">notifications</span>
      </button>
      <div class="top-app-bar__avatar">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWvwSgN8F4S5OCCPVeq13PMzZmwDGdrFIcF_1WDkGTSQHCJFVUGWZkVTBavmA7ym8AuYpy2MIB7wD-QpaQGnJaZ3xfk2g-wSR0ECTtXw_DIGwYuO63R_LPRu5v3P-bYwB2SJ_HFnTMYoYD7yEMKVcWVo6QbNTuvZ_j15_awLKBQF_Q7-AL9z3q1-jMgC3POo6BJUWI7ONZhHPaiI23Czs0xdVV7oMaNWoMSlG33CJz4Lm1ZfrrE7xWSxg4XyO-ukjlz4WIKsnTReS9" 
          alt="Usuario" 
          class="top-app-bar__avatar-img"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-app-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: var(--space-8) var(--space-12);
  background-color: transparent;
  width: 100%;
}

.top-app-bar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.top-app-bar__btn {
  background: transparent;
  border: none;
  color: var(--color-outline);
  cursor: pointer;
  transition: color var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.top-app-bar__btn:hover {
  color: var(--color-primary);
}

.top-app-bar__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-container-high);
  overflow: hidden;
  border: 1px solid rgba(192, 200, 204, 0.2);
}

.top-app-bar__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>