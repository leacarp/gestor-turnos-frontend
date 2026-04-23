<script setup lang="ts">
import { useOnboardingStore } from '@/stores/useOnboardingStore'
import AppInput from '@/components/AppInput.vue'

const store = useOnboardingStore()
</script>

<template>
  <div class="step-identity">
    <div class="step-identity__header">
      <span class="step-identity__badge">Paso 1 de 4</span>
      <h2 class="step-identity__title">Creá tu cuenta</h2>
    </div>

    <form class="step-identity__form" @submit.prevent>
      <AppInput
        v-model="store.identity.nombre"
        label="Nombre completo"
        iconLeft="person"
        placeholder="Ej: Juan Pérez"
      />
      
      <AppInput
        v-model="store.identity.email"
        type="email"
        label="Email"
        iconLeft="mail"
        placeholder="hola@tunegocio.com"
      />
      
      <AppInput
        v-model="store.identity.telefono"
        type="tel"
        label="Teléfono (WhatsApp)"
        iconLeft="call"
        placeholder="+54 9 11 1234-5678"
      />
      
      <AppInput
        v-model="store.identity.password"
        type="password"
        label="Contraseña"
        iconLeft="lock"
        placeholder="Mínimo 8 caracteres"
      />
    </form>
    
    <div class="step-identity__login-link">
      <p>
        ¿Ya tenés cuenta? 
        <router-link to="/login" class="step-identity__link">Iniciar sesión</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.step-identity {
  width: 100%;
  max-width: 28rem;
}

.step-identity__header {
  margin-bottom: var(--space-10);
}

.step-identity__badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  background-color: var(--color-secondary-container);
  color: var(--color-primary-container);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
}

.step-identity__title {
  font-size: var(--font-size-3xl);
  font-family: var(--font-family-headline);
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.step-identity__subtitle {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.step-identity__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.step-identity__login-link {
  margin-top: var(--space-8);
  text-align: center;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.step-identity__link {
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
}
.step-identity__link:hover {
  text-decoration: underline;
}
</style>