# HOW-TO: Services y conexión con el backend NestJS

Manual para implementar llamadas HTTP consumiendo los endpoints del backend.

---

## 1. Arquitectura del backend — cómo leerlo

El backend usa arquitectura hexagonal/en capas. Para cada módulo la estructura es:

```
src/{modulo}/
├── domain/
│   ├── entities/        ← tipos de datos del dominio (leer para interfaces)
│   └── interfaces/      ← interfaces de repositorio (referencia, no tocar)
├── infrastructure/
│   ├── repositories/    ← acceso a BD (no tocar)
│   └── schemas/         ← modelo de mongoose (útil para ver campos exactos)
├── presentation/
│   ├── controllers/     ← ★ LEER PRIMERO — rutas, métodos HTTP, guards
│   └── dtos/            ← ★ LEER SEGUNDO — shapes de request/response
└── services/
    ├── dto/             ← DTOs internos del servicio
    ├── interfaces/      ← interfaz del servicio
    └── {modulo}.service.ts  ← lógica de negocio (leer si hay duda de comportamiento)
```

### Orden de lectura obligatorio antes de implementar cualquier service frontend

1. `presentation/controllers/{modulo}.controller.ts` → rutas, métodos, guards JWT
2. `presentation/dtos/` → shapes exactos de request y response
3. `domain/entities/` → tipo completo si el response no está en los DTOs
4. `infrastructure/schemas/` → campos de BD si necesitás entender la estructura

---

## 2. Checklist antes de implementar

- [ ] Leí el controller — sé qué rutas existen y si requieren JWT (`@UseGuards(JwtAuthGuard)`)
- [ ] Leí los DTOs — sé exactamente qué campos enviar y qué recibir
- [ ] Creé los tipos en `src/types/{modulo}.ts` espejando los DTOs
- [ ] Si el endpoint requiere JWT → el interceptor de axios lo inyecta automáticamente

---

## 3. Configuración de Axios — `src/lib/axios.ts`

```typescript
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: inyectar JWT en cada request autenticado
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

## 4. Patrón de service — uno por módulo

```typescript
// src/services/turnosService.ts
import { apiClient } from '@/lib/axios'
import type { Turno, CreateTurnoDto, UpdateTurnoDto } from '@/types/turno'

export const turnosService = {
  getAll: () =>
    apiClient.get<Turno[]>('/turnos'),

  getById: (id: string) =>
    apiClient.get<Turno>(`/turnos/${id}`),

  create: (dto: CreateTurnoDto) =>
    apiClient.post<Turno>('/turnos', dto),

  update: (id: string, dto: UpdateTurnoDto) =>
    apiClient.patch<Turno>(`/turnos/${id}`, dto),

  remove: (id: string) =>
    apiClient.delete<void>(`/turnos/${id}`),
}
```

---

## 5. Patrón de Store Pinia — uno por módulo

```typescript
// src/stores/useTurnosStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { turnosService } from '@/services/turnosService'
import type { Turno, CreateTurnoDto } from '@/types/turno'

export const useTurnosStore = defineStore('turnos', () => {
  const turnos = ref<Turno[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const turnosPendientes = computed(() =>
    turnos.value.filter(t => t.estado === 'pendiente')
  )

  async function fetchTurnos() {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await turnosService.getAll()
      turnos.value = data
    } catch (err) {
      error.value = 'Error al cargar los turnos'
      console.error('[useTurnosStore]', err)
    } finally {
      isLoading.value = false
    }
  }

  async function createTurno(dto: CreateTurnoDto) {
    const { data } = await turnosService.create(dto)
    turnos.value.push(data)
    return data
  }

  return { turnos, isLoading, error, turnosPendientes, fetchTurnos, createTurno }
})
```

---

## 6. Mapa de módulos backend → services frontend

| Módulo backend | Controller path | Service frontend |
|---------------|----------------|-----------------|
| `auth` | `src/auth/presentation/controllers/` | `src/services/authService.ts` |
| `user` | `src/user/presentation/controllers/` | `src/services/userService.ts` |
| `turnos` | `src/turnos/presentation/controllers/` | `src/services/turnosService.ts` |
| `availability` | `src/availability/presentation/controllers/` | `src/services/availabilityService.ts` |
| `servicios` | `src/servicios/presentation/controllers/` | `src/services/serviciosService.ts` |
| `pagos` | `src/pagos/presentation/controllers/` | `src/services/pagosService.ts` |
| `mercadopago` | `src/mercadopago/presentation/controllers/` | `src/services/mercadopagoService.ts` |

---

## 7. Variables de entorno

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000
```

Acceder siempre con `import.meta.env.VITE_*` — nunca `process.env`.
