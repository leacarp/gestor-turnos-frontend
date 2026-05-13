# HOW-TO: Autenticación — Login y Register

Manual específico para conectar las vistas de auth con el backend.

---

## 1. Archivos del backend a leer SIEMPRE antes de implementar

```
../gestor-turnos-backend/src/auth/
├── presentation/
│   ├── controllers/     ← rutas exactas, métodos, guards
│   └── dtos/            ← LoginDto, RegisterDto, respuesta con token
└── services/
    └── auth.service.ts  ← leer si hay duda sobre qué devuelve
```

---

## 2. Tipos — `src/types/auth.ts`

Espejar exactamente los DTOs del backend. Ajustar si el backend difiere.

```typescript
// src/types/auth.ts

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  nombre: string
  apellido: string
  // agregar campos según el DTO real del backend
}

export interface AuthResponse {
  access_token: string   // verificar nombre exacto en el backend
  user: {
    id: string
    email: string
    nombre: string
    apellido: string
    rol: string
  }
}
```

---

## 3. Auth Service — `src/services/authService.ts`

```typescript
import { apiClient } from '@/lib/axios'
import type { LoginDto, RegisterDto, AuthResponse } from '@/types/auth'

export const authService = {
  login: (dto: LoginDto) =>
    apiClient.post<AuthResponse>('/auth/login', dto),

  register: (dto: RegisterDto) =>
    apiClient.post<AuthResponse>('/auth/register', dto),

  // Si el backend tiene endpoint de perfil autenticado
  getProfile: () =>
    apiClient.get<AuthResponse['user']>('/auth/profile'),
}
```

---

## 4. Auth Store — `src/stores/useAuthStore.ts`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import type { LoginDto, RegisterDto, AuthResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<AuthResponse['user'] | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ── Getters ────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)

  // ── Actions ────────────────────────────────────────────
  async function login(dto: LoginDto) {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await authService.login(dto)
      _setSession(data)
    } catch (err: unknown) {
      error.value = _parseError(err, 'Credenciales incorrectas')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(dto: RegisterDto) {
    isLoading.value = true
    error.value = null
    try {
      const { data } = await authService.register(dto)
      _setSession(data)
    } catch (err: unknown) {
      error.value = _parseError(err, 'Error al crear la cuenta')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  // ── Helpers privados ───────────────────────────────────
  function _setSession(data: AuthResponse) {
    token.value = data.access_token
    user.value = data.user
    localStorage.setItem('auth_token', data.access_token)
  }

  function _parseError(err: unknown, fallback: string): string {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
    ) {
      return (err as { response: { data: { message: string } } }).response.data.message
    }
    return fallback
  }

  return {
    token, user, isLoading, error, isAuthenticated,
    login, register, logout,
  }
}, {
  // Persistir en localStorage automáticamente con pinia-plugin-persistedstate
  // Si no está instalado, el localStorage.setItem manual del store lo reemplaza
})
```

---

## 5. Conectar LoginView.vue

La vista ya existe visualmente. Solo agregar la lógica:

```typescript
// Dentro de <script setup lang="ts"> en LoginView.vue
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

async function handleSubmit() {
  try {
    await authStore.login(form)
    await router.push({ name: 'home' })   // ajustar ruta destino
  } catch {
    // el error ya está en authStore.error — mostrarlo en el template
  }
}
```

En el template, conectar el formulario:
```html
<!-- en el <form> o el botón submit -->
@submit.prevent="handleSubmit"

<!-- en los inputs -->
v-model="form.email"
v-model="form.password"

<!-- para mostrar el error -->
<p v-if="authStore.error" class="form__error">{{ authStore.error }}</p>

<!-- para deshabilitar el botón mientras carga -->
:disabled="authStore.isLoading"
:is-loading="authStore.isLoading"
```

---

## 6. Conectar RegisterView / OnboardingView

Mismo patrón que login, cambiando `authStore.login` por `authStore.register` y el form con los campos del `RegisterDto`.

---

## 7. Guard de rutas — ya configurado en HOW-TO-ROUTER.md

El guard usa `authStore.isAuthenticated`. Con el store correctamente implementado, el guard funciona automáticamente:
- Ruta protegida + sin token → redirige a `/login`
- Ya logueado + intenta ir a `/login` → redirige a `/home`

---

## 8. Errores comunes a evitar

```typescript
// MAL — guardar el token en el componente
const token = ref(response.data.access_token)  // se pierde al recargar

// MAL — llamar al service directamente desde el componente
const { data } = await authService.login(form)  // saltarse el store

// MAL — no manejar el error en el template
await authStore.login(form)  // si falla, el usuario no ve nada

// BIEN — siempre try/catch en el handler del componente
// BIEN — mostrar authStore.error en el template
// BIEN — deshabilitar el botón con authStore.isLoading
```
