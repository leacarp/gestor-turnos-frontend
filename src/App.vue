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

/* ── Base responsive ────────────────────────────────────────
 * Reglas globales mínimas para que la app se banque un celular.
 * Todo lo demás vive scoped en cada componente.
 * ───────────────────────────────────────────────────────── */

/* iOS infla el texto al rotar a horizontal si no se lo frena. */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* Nada multimedia se sale del contenedor. */
img,
svg,
video {
  max-width: 100%;
  height: auto;
}

/* Safari en iOS hace zoom al enfocar un input con fuente < 16px, y con
 * `html { font-size: 80% }` todos los inputs quedan por debajo. En celular
 * los forzamos a 16px reales; de 768px para arriba no hay zoom que evitar
 * y vuelven a heredar la escala del diseño. */
@media (max-width: 767px) {
  input,
  select,
  textarea {
    font-size: 16px;
  }
}

/* Respetar "reducir movimiento" del sistema: en mobile las transiciones
 * de la bottom nav y los sheets son las que más molestan. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
