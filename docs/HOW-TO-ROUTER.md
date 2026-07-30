# HOW-TO: Router y Navigation Guards

---

## 1. Configuración base — `src/router/index.ts`

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Auth (sin layout de dashboard) ────────────────
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },

    // ── App (con layout de dashboard) ─────────────────
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'turnos',
          name: 'turnos',
          component: () => import('@/views/TurnosView.vue'),
        },
        {
          path: 'turnos/:id',
          name: 'turno-detail',
          component: () => import('@/views/TurnoDetailView.vue'),
        },
      ],
    },

    // ── 404 ───────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// Navigation guard global
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
```

---

## 2. Meta tipado — `src/types/router.d.ts`

```typescript
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
    title?: string
  }
}
```

---

## 3. Lazy loading — siempre en rutas

```typescript
// BIEN — carga diferida, bundle splitting automático
component: () => import('@/views/TurnosView.vue')

// MAL — importación estática, engrosa el bundle inicial
import TurnosView from '@/views/TurnosView.vue'
component: TurnosView
```
