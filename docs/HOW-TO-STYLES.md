# HOW-TO: Estilos y Design System

Manual para replicar los diseños de Stitch y mantener consistencia visual.

---

## 1. Proceso obligatorio al crear UI

1. **Identificar** qué HTML de referencia aplica en `docs/design-references/`
2. **Leer** el HTML completo — no asumir, no inventar
3. **Extraer** todos los tokens visuales:
   - Colores (hex exactos o variables CSS)
   - Tipografía (font-family, font-size, font-weight, line-height, letter-spacing)
   - Espaciado (padding, margin, gap — valores exactos)
   - Bordes (border-width, border-color, border-radius)
   - Sombras (box-shadow exacto)
   - Transiciones (duration, easing)
4. **Registrar** en `src/assets/styles/tokens.css` si no existen aún
5. **Implementar** en `<style scoped>` consumiendo las variables

---

## 2. Tokens CSS — `src/assets/styles/tokens.css`

Todos los valores visuales van aquí. Nunca hardcodear en componentes.

```css
:root {
  /* ── Colores ─────────────────────────────────────────── */
  /* Extraer del HTML de Stitch y completar */
  --color-primary:       #COMPLETAR;
  --color-primary-hover: #COMPLETAR;
  --color-secondary:     #COMPLETAR;
  --color-accent:        #COMPLETAR;

  --color-surface:       #COMPLETAR;  /* fondo de cards */
  --color-background:    #COMPLETAR;  /* fondo de página */
  --color-border:        #COMPLETAR;

  --color-text-primary:   #COMPLETAR;
  --color-text-secondary: #COMPLETAR;
  --color-text-disabled:  #COMPLETAR;

  --color-success:  #COMPLETAR;
  --color-warning:  #COMPLETAR;
  --color-error:    #COMPLETAR;
  --color-info:     #COMPLETAR;

  /* ── Tipografía ──────────────────────────────────────── */
  --font-family-base:    'COMPLETAR', sans-serif;
  --font-family-display: 'COMPLETAR', sans-serif;

  --font-size-xs:   0.75rem;   /* 12px */
  --font-size-sm:   0.875rem;  /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg:   1.125rem;  /* 18px */
  --font-size-xl:   1.25rem;   /* 20px */
  --font-size-2xl:  1.5rem;    /* 24px */
  --font-size-3xl:  1.875rem;  /* 30px */

  --font-weight-normal:   400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;

  --line-height-tight:  1.25;
  --line-height-normal: 1.5;
  --line-height-loose:  1.75;

  /* ── Espaciado (escala de 4px) ───────────────────────── */
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */

  /* ── Bordes ──────────────────────────────────────────── */
  --radius-sm: COMPLETAR;
  --radius-md: COMPLETAR;
  --radius-lg: COMPLETAR;
  --radius-xl: COMPLETAR;
  --radius-full: 9999px;

  --border-width: 1px;
  --border-color: var(--color-border);

  /* ── Sombras ─────────────────────────────────────────── */
  --shadow-sm: COMPLETAR;  /* copiar exacto del HTML Stitch */
  --shadow-md: COMPLETAR;
  --shadow-lg: COMPLETAR;

  /* ── Transiciones ────────────────────────────────────── */
  --transition-fast:   150ms ease;
  --transition-base:   200ms ease;
  --transition-slow:   300ms ease;

  /* ── Layout ──────────────────────────────────────────── */
  --container-max-width: 1280px;
  --sidebar-width:       260px;
  --header-height:       64px;
}
```

---

## 3. Replicar un componente Stitch — ejemplo botón

Dado este HTML de referencia en `docs/design-references/button.html`:
```html
<button class="btn btn-primary">Reservar turno</button>
```

Proceso de extracción → implementación en Vue:

```vue
<!-- src/components/AppButton.vue -->
<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="app-button"
    :class="[
      `app-button--${variant ?? 'primary'}`,
      `app-button--${size ?? 'md'}`,
      { 'app-button--loading': isLoading }
    ]"
    :disabled="disabled || isLoading"
    type="button"
  >
    <span v-if="isLoading" class="app-button__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
/* Extraídos EXACTAMENTE del HTML de Stitch */
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    box-shadow var(--transition-fast),
    opacity var(--transition-fast);
}

/* Tamaños */
.app-button--sm { padding: var(--space-1) var(--space-3); font-size: var(--font-size-sm); }
.app-button--md { padding: var(--space-2) var(--space-4); font-size: var(--font-size-base); }
.app-button--lg { padding: var(--space-3) var(--space-6); font-size: var(--font-size-lg); }

/* Variantes — colores exactos del diseño Stitch */
.app-button--primary {
  background: var(--color-primary);
  color: #fff;
}
.app-button--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.app-button--secondary {
  background: transparent;
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.app-button--ghost {
  background: transparent;
  color: var(--color-text-primary);
}

.app-button--danger {
  background: var(--color-error);
  color: #fff;
}

/* Estados */
.app-button:disabled,
.app-button--loading {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Spinner */
.app-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

---

## 4. Cómo agregar un nuevo HTML de referencia Stitch

1. Guardar el archivo en `docs/design-references/nombre-componente.html`
2. En el chat de Cursor escribir:
   ```
   @docs/design-references/nombre-componente.html
   Implementar este componente en Vue 3 con <style scoped>,
   extrayendo todos los valores a tokens.css. No interpretar,
   replicar fielmente.
   ```
3. Revisar que los tokens nuevos se agregaron a `tokens.css`

---

## 5. Anti-patrones — nunca hacer esto

```css
/* MAL — valores hardcodeados */
color: #3b82f6;
border-radius: 8px;
padding: 16px 24px;

/* MAL — estilos globales en SFC */
/* sin scoped: afecta toda la app */

/* MAL — importar librerías de componentes no aprobadas */
import { Button } from 'primevue'
```
