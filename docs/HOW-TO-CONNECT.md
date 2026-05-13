# HOW-TO: Conectar una vista con el backend

Manual genérico reutilizable para cualquier conexión frontend → backend.

---

## Arquitectura del backend — recordatorio rápido

```
src/{modulo}/
├── presentation/
│   ├── controllers/   ← leer PRIMERO — rutas, métodos HTTP, guards JWT
│   └── dtos/          ← leer SEGUNDO — shapes exactos de request/response
├── domain/entities/   ← leer si el response no está en los DTOs
└── services/          ← leer solo si hay duda de comportamiento
```

---

## Orden de implementación — siempre el mismo

```
1. Leer backend (controller + dtos)
2. src/types/{modulo}.ts        ← interfaces que espeja los DTOs
3. src/services/{modulo}Service.ts  ← llamadas HTTP
4. src/stores/use{Modulo}Store.ts   ← estado + acciones
5. Conectar la vista              ← v-model, handlers, mostrar error/loading
```

Nunca saltear pasos ni invertir el orden.

---

## Plantilla de tipos

```typescript
// src/types/{modulo}.ts
// Espeja ../gestor-turnos-backend/src/{modulo}/presentation/dtos/

export interface {Modulo} {
  id: string
  // campos según entity del backend
}

export interface Create{Modulo}Dto {
  // campos según CreateDto del backend
}

export interface Update{Modulo}Dto {
  // campos opcionales según UpdateDto del backend
}
```

---

## Plantilla de service

```typescript
// src/services/{modulo}Service.ts
import { apiClient } from '@/lib/axios'
import type { Modulo, CreateModuloDto, UpdateModuloDto } from '@/types/{modulo}'

export const {modulo}Service = {
  getAll: () =>
    apiClient.get<Modulo[]>('/{ruta}'),

  getById: (id: string) =>
    apiClient.get<Modulo>(`/{ruta}/${id}`),

  create: (dto: CreateModuloDto) =>
    apiClient.post<Modulo>('/{ruta}', dto),

  update: (id: string, dto: UpdateModuloDto) =>
    apiClient.patch<Modulo>(`/{ruta}/${id}`, dto),

  remove: (id: string) =>
    apiClient.delete<void>(`/{ruta}/${id}`),
}
```

---

## Plantilla de store

```typescript
// src/stores/use{Modulo}Store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { {modulo}Service } from '@/services/{modulo}Service'
import type { Modulo, CreateModuloDto } from '@/types/{modulo}'

export const use{Modulo}Store = defineStore('{modulo}', () => {
  const items = ref<Modulo[]>([])
  const selected = ref<Modulo | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await {modulo}Service.getAll()
      items.value = data
    } catch (err) {
      error.value = 'Error al cargar los datos'
      console.error('[use{Modulo}Store]', err)
    } finally {
      isLoading.value = false
    }
  }

  async function create(dto: CreateModuloDto) {
    const { data } = await {modulo}Service.create(dto)
    items.value.push(data)
    return data
  }

  async function remove(id: string) {
    await {modulo}Service.remove(id)
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, selected, isLoading, error, fetchAll, create, remove }
})
```

---

## Conectar la vista — patrón estándar

```typescript
// En <script setup lang="ts"> de cualquier vista
import { onMounted } from 'vue'
import { use{Modulo}Store } from '@/stores/use{Modulo}Store'

const store = use{Modulo}Store()

onMounted(() => store.fetchAll())

async function handleSubmit() {
  try {
    await store.create(form)
    // redirigir o mostrar éxito
  } catch {
    // el error ya está en store.error — mostrarlo en el template
  }
}
```

```html
<!-- En el template — siempre estos tres patrones -->

<!-- 1. Loading -->
<div v-if="store.isLoading">Cargando...</div>

<!-- 2. Error -->
<p v-if="store.error" class="form__error">{{ store.error }}</p>

<!-- 3. Botón deshabilitado mientras carga -->
<AppButton :disabled="store.isLoading" :is-loading="store.isLoading">
  Guardar
</AppButton>
```

---

## Mapa de módulos — backend → frontend

| Módulo | Controller | Service frontend | Store |
|--------|-----------|-----------------|-------|
| auth | `src/auth/presentation/controllers/` | `authService.ts` | `useAuthStore.ts` |
| user | `src/user/presentation/controllers/` | `userService.ts` | `useUserStore.ts` |
| turnos | `src/turnos/presentation/controllers/` | `turnosService.ts` | `useTurnosStore.ts` |
| availability | `src/availability/presentation/controllers/` | `availabilityService.ts` | `useAvailabilityStore.ts` |
| servicios | `src/servicios/presentation/controllers/` | `serviciosService.ts` | `useServiciosStore.ts` |
| pagos | `src/pagos/presentation/controllers/` | `pagosService.ts` | `usePagosStore.ts` |
| mercadopago | `src/mercadopago/presentation/controllers/` | `mercadopagoService.ts` | `useMercadopagoStore.ts` |

---

## Errores comunes — nunca hacer esto

```typescript
// MAL — llamar el service directo desde el componente
const { data } = await turnosService.getAll()

// MAL — no manejar loading ni error en el template
await store.fetchAll()  // si tarda o falla, el usuario no ve nada

// MAL — inventar rutas o campos sin leer el backend
apiClient.get('/api/turnos')  // puede no existir

// MAL — usar any
const data: any = response.data
```