<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* Los estilos globales base se cargarán a través de tokens.css desde main.ts */
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
