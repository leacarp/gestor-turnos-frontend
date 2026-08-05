<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppInput from '@/components/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

/** El guard del router o el interceptor de 401 nos manda acá con ?expired=1 */
const sesionVencida = computed(() => route.query.expired === '1')

/**
 * Ruta a la que volver después de loguearse. Solo aceptamos paths internos:
 * un `redirect` con host propio sería un open redirect.
 */
function destinoDeVuelta(): string | null {
  const redirect = route.query.redirect
  if (typeof redirect !== 'string') return null
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return null
  return redirect
}

async function handleLogin() {
  try {
    await authStore.login(form)

    // Un cliente no tiene nada que hacer en el dashboard del proveedor, así que
    // el redirect solo aplica al resto de los roles.
    const vuelta = authStore.user?.role === 'client' ? null : destinoDeVuelta()
    if (vuelta) {
      await router.push(vuelta)
      return
    }

    await router.push({ name: authStore.user?.role === 'client' ? 'landing' : 'home' })
  } catch {
    // error en authStore.error
  }
}
</script>

<template>
  <main class="login-view">
    <div class="login-view__container">
      <div class="login-view__header">
        <h1 class="login-view__title">Iniciar sesión</h1>
        <p class="login-view__subtitle">Ingresá a tu cuenta para gestionar tus turnos.</p>
      </div>

      <p v-if="sesionVencida" class="login-view__notice" role="status">
        <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
        Tu sesión expiró. Iniciá sesión de nuevo para continuar.
      </p>

      <form class="login-view__form" @submit.prevent="handleLogin">
        <AppInput
          v-model="form.email"
          type="email"
          label="Email"
          iconLeft="mail"
          placeholder="hola@tunegocio.com"
          required
        />

        <AppInput
          v-model="form.password"
          type="password"
          label="Contraseña"
          iconLeft="lock"
          placeholder="Mínimo 6 caracteres"
          required
        />

        <p v-if="authStore.error" class="login-view__error">{{ authStore.error }}</p>

        <AppButton
          type="submit"
          variant="gradient"
          fullWidth
          :isLoading="authStore.isLoading"
          :disabled="authStore.isLoading"
        >
          Iniciar sesión
        </AppButton>
      </form>

      <div class="login-view__register-link">
        <p>
          ¿No tenés cuenta?
          <router-link to="/register/onboarding" class="login-view__link">Crear cuenta</router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-surface);
  padding: var(--space-8);
}

.login-view__container {
  width: 100%;
  max-width: 28rem;
  background-color: var(--color-background);
  padding: var(--space-8);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
}

.login-view__header {
  margin-bottom: var(--space-10);
  text-align: center;
}

.login-view__title {
  font-size: var(--font-size-3xl);
  font-family: var(--font-family-headline);
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.login-view__subtitle {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.login-view__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.login-view__error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin: 0;
}

.login-view__notice {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0 0 var(--space-6);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface-container-low);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.login-view__notice .material-symbols-outlined {
  font-size: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.login-view__register-link {
  margin-top: var(--space-8);
  text-align: center;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.login-view__link {
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
}

.login-view__link:hover {
  text-decoration: underline;
}
</style>
