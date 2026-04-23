# HOW-TO: Services y conexión con el backend NestJS

Manual para implementar llamadas HTTP consumiendo los endpoints del backend.

---

## 1. Proceso obligatorio antes de escribir cualquier service

```
../gestor-turnos-backend/src/
├── {modulo}/
│   ├── presentation/
│   │   ├── controllers/     ← leer esto primero — rutas y métodos HTTP
│   │   └── dtos/            ← leer esto segundo — shapes de datos
│   └── domain/
│       └── entities/        ← leer si necesitás el tipo completo
```

### Checklist antes de implementar
- [ ] Leí el controller del módulo
- [ ] Identifiqué todas las rutas (GET, POST, PATCH, DELETE)
- [ ] Leí los DTOs de request y response
- [ ] Creé los tipos en `src/types/{modulo}.ts`
- [ ] Configuré autenticación si el endpoint la requiere (JWT guard en el backend)

---

## 2. Configuración de Axios — `src/lib/axios.ts`

```typescript
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: inyectar JWT en cada request
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Interceptor: manejar 401 globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)
```

---

## 3. Patrón de service — uno por módulo del backend

```typescript
// src/services/turnosService.ts
// Basado en ../gestor-turnos-backend/src/turnos/presentation/controllers/turnos.controller.ts

import { apiClient } from '@/lib/axios'
import type { Turno, CreateTurnoDto, UpdateTurnoDto } from '@/types/turno'

export const turnosService = {
  getAll: () =>
    apiClient.get<Turno[]>('/turnos'),

  getById: (id: number) =>
    apiClient.get<Turno>(`/turnos/${id}`),

  getByPaciente: (pacienteId: number) =>
    apiClient.get<Turno[]>(`/turnos/paciente/${pacienteId}`),

  create: (dto: CreateTurnoDto) =>
    apiClient.post<Turno>('/turnos', dto),

  update: (id: number, dto: UpdateTurnoDto) =>
    apiClient.patch<Turno>(`/turnos/${id}`, dto),

  cancel: (id: number) =>
    apiClient.patch<Turno>(`/turnos/${id}/cancel`),

  remove: (id: number) =>
    apiClient.delete<void>(`/turnos/${id}`),
}
```

---

## 4. Tipos — espejando el backend exactamente

```typescript
// src/types/turno.ts
// Espeja: ../gestor-turnos-backend/src/turnos/presentation/dtos/

export type TurnoEstado = 'pendiente' | 'confirmado' | 'cancelado' | 'completado'

// Espeja la entidad del backend
export interface Turno {
  id: number
  fecha: string          // ISO 8601: "2024-03-15T10:00:00.000Z"
  estado: TurnoEstado
  pacienteId: number
  servicioId: number
  profesionalId: number
  notas?: string
  createdAt: string
  updatedAt: string
}

// Espeja CreateTurnoDto del backend
export interface CreateTurnoDto {
  fecha: string
  pacienteId: number
  servicioId: number
  profesionalId: number
  notas?: string
}

// Espeja UpdateTurnoDto del backend
export interface UpdateTurnoDto {
  fecha?: string
  estado?: TurnoEstado
  notas?: string
}
```

---

## 5. Store de Pinia — manejo de estado global

```typescript
// src/stores/useTurnosStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { turnosService } from '@/services/turnosService'
import type { Turno, CreateTurnoDto } from '@/types/turno'

export const useTurnosStore = defineStore('turnos', () => {
  // ── State ──────────────────────────────────────────────
  const turnos = ref<Turno[]>([])
  const selectedTurno = ref<Turno | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ── Getters ────────────────────────────────────────────
  const turnosPendientes = computed(() =>
    turnos.value.filter(t => t.estado === 'pendiente')
  )

  const turnosHoy = computed(() => {
    const today = new Date().toDateString()
    return turnos.value.filter(t =>
      new Date(t.fecha).toDateString() === today
    )
  })

  // ── Actions ────────────────────────────────────────────
  async function fetchTurnos() {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await turnosService.getAll()
      turnos.value = data
    } catch (err) {
      error.value = 'Error al cargar los turnos'
      console.error('[useTurnosStore] fetchTurnos:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createTurno(dto: CreateTurnoDto) {
    const { data } = await turnosService.create(dto)
    turnos.value.push(data)
    return data
  }

  async function cancelTurno(id: number) {
    const { data } = await turnosService.cancel(id)
    const index = turnos.value.findIndex(t => t.id === id)
    if (index !== -1) turnos.value[index] = data
  }

  function selectTurno(turno: Turno | null) {
    selectedTurno.value = turno
  }

  return {
    turnos, selectedTurno, isLoading, error,
    turnosPendientes, turnosHoy,
    fetchTurnos, createTurno, cancelTurno, selectTurno,
  }
})
```

---

## 6. Módulos del backend → services del frontend

| Módulo backend | Controller | Service frontend |
|---------------|-----------|-----------------|
| `auth` | `/auth/login`, `/auth/register` | `src/services/authService.ts` |
| `user` | `/users` | `src/services/usersService.ts` |
| `turnos` | `/turnos` | `src/services/turnosService.ts` |
| `availability` | `/availability` | `src/services/availabilityService.ts` |
| `servicios` | `/servicios` | `src/services/serviciosService.ts` |
| `mercadopago` | `/pagos` | `src/services/pagosService.ts` |

---

## 7. Variables de entorno

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_API_BASE_URL=https://tu-dominio.com/api
```

Acceder siempre con `import.meta.env.VITE_*` (nunca `process.env`).
