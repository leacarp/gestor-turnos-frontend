<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* Los estilos globales base se cargarán a través de tokens.css desde main.ts */
html {
  font-size: 80%; /* Escala la base a 12.8px en lugar de 16px para que toda la UI se achique proporcionalmente sin afectar la grilla líquida */
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family-body);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}
</style>
