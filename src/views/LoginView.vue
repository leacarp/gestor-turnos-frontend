<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppInput from '@/components/AppInput.vue'
import AppButton from '@/components/AppButton.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

function handleLogin() {
  isLoading.value = true
  // TODO: Implementar lógica de autenticación
  setTimeout(() => {
    isLoading.value = false
    router.push('/')
  }, 1000)
}
</script>

<template>
  <main class="login-view">
    <div class="login-view__container">
      <div class="login-view__header">
        <h1 class="login-view__title">Iniciar sesión</h1>
        <p class="login-view__subtitle">Ingresá a tu cuenta para gestionar tus turnos.</p>
      </div>

      <form class="login-view__form" @submit.prevent="handleLogin">
        <AppInput
          v-model="email"
          type="email"
          label="Email"
          iconLeft="mail"
          placeholder="hola@tunegocio.com"
          required
        />
        
        <AppInput
          v-model="password"
          type="password"
          label="Contraseña"
          iconLeft="lock"
          placeholder="Tu contraseña"
          required
        />
        
        <AppButton 
          type="submit" 
          variant="gradient" 
          fullWidth 
          :isLoading="isLoading"
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
