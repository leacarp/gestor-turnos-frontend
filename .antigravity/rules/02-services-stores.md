# Regla 02 — Services HTTP y Stores Pinia
> Aplica a: `src/services/**/*.ts`, `src/stores/**/*.ts`, `src/types/**/*.ts`
> Leer `docs/HOW-TO-SERVICES.md` antes de crear o modificar services o stores.

---

## Paso 0 — obligatorio antes de implementar cualquier llamada HTTP

1. Abrir `../gestor-turnos-backend/src/{modulo}/presentation/controllers/{modulo}.controller.ts`
2. Identificar: método HTTP, ruta exacta, body esperado, estructura de respuesta
3. Abrir `../gestor-turnos-backend/src/{modulo}/presentation/dtos/` para ver los DTOs
4. Crear o actualizar los tipos en `src/types/{modulo}.ts` espejando los DTOs del backend
5. Recién entonces implementar el service

> **Nunca inventar endpoints ni asumir la forma de los datos. Siempre leer el backend primero.**

---

## Patrón de Service

```typescript
// src/services/turnosService.ts
import { apiClient } from '@/lib/axios'
import type { Turno, CreateTurnoDto, UpdateTurnoDto } from '@/types/turno'

export const turnosService = {
  getAll: () =>
    apiClient.get<Turno[]>('/turnos'),

  getById: (id: number) =>
    apiClient.get<Turno>(`/turnos/${id}`),

  create: (dto: CreateTurnoDto) =>
    apiClient.post<Turno>('/turnos', dto),

  update: (id: number, dto: UpdateTurnoDto) =>
    apiClient.patch<Turno>(`/turnos/${id}`, dto),

  remove: (id: number) =>
    apiClient.delete<void>(`/turnos/${id}`),
}
```

---

## Patrón de Store (Pinia — Setup Store)

```typescript
// src/stores/useTurnosStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { turnosService } from '@/services/turnosService'
import type { Turno } from '@/types/turno'

export const useTurnosStore = defineStore('turnos', () => {
  // ── State ────────────────────────────────────────────────
  const turnos = ref<Turno[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ── Getters ──────────────────────────────────────────────
  const turnosActivos = computed(() =>
    turnos.value.filter(t => t.estado === 'activo')
  )

  // ── Actions ──────────────────────────────────────────────
  async function fetchTurnos() {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await turnosService.getAll()
      turnos.value = data
    } catch (err) {
      error.value = 'Error al cargar los turnos'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return { turnos, isLoading, error, turnosActivos, fetchTurnos }
})
```

---

## Patrón de Tipos — espejando el backend

```typescript
// src/types/turno.ts
// Espeja: ../gestor-turnos-backend/src/turnos/presentation/dtos/

export interface Turno {
  id: number
  fecha: string           // ISO 8601
  estado: 'activo' | 'cancelado' | 'completado'
  pacienteId: number
  servicioId: number
  createdAt: string
}

export interface CreateTurnoDto {
  fecha: string
  pacienteId: number
  servicioId: number
}

export interface UpdateTurnoDto {
  fecha?: string
  estado?: Turno['estado']
}
```

---

## Reglas de stores

- Siempre usar **Setup Store** (función con `return`), no Options Store
- El estado de carga usa siempre `isLoading: ref(false)`
- Los errores usan siempre `error: ref<string | null>(null)`
- Los getters van como `computed()` dentro del store
- Las actions son funciones `async` declaradas con `function` (no arrow)
- Nunca llamar directamente `axios` desde un componente — siempre pasar por el service

---

## Anti-patrones — nunca hacer esto

```typescript
// ❌ Llamar axios directamente desde un componente
const { data } = await axios.get('/turnos')

// ❌ Inventar un endpoint sin leer el backend
apiClient.get('/api/v1/appointments')  // ruta no verificada

// ❌ Tipado con any
const response: any = await turnosService.getAll()

// ❌ Options Store en lugar de Setup Store
export const useTurnosStore = defineStore('turnos', {
  state: () => ({ turnos: [] }),
})
```
