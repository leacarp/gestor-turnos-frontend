# Regla 03 — Sistema de Diseño y Estilos
> Aplica a: `src/components/**/*.vue`, `src/views/**/*.vue`, `src/assets/**/*.css`
> Leer `docs/HOW-TO-STYLES.md` antes de crear o modificar cualquier UI.

---

## Fuente de verdad visual

Los archivos HTML en `docs/design-references/` son la referencia **exacta** del diseño.
No interpretar. No inventar. Replicar fielmente.

### Referencias disponibles

| Carpeta | Qué contiene |
|---|---|
| `docs/design-references/login-onboarding-1/` | Pantalla de onboarding 1 |
| `docs/design-references/login-onboarding-2/` | Pantalla de onboarding 2 |
| `docs/design-references/login-onboarding-3/` | Pantalla de onboarding 3 |
| `docs/design-references/login-onboarding-4/` | Pantalla de onboarding 4 |
| `docs/design-references/service-view/` | Vista catálogo de servicios |
| `docs/design-references/sidebar-reference.png` | Referencia visual del sidebar |

---

## Proceso obligatorio al crear UI

1. **Identificar** qué archivo de `docs/design-references/` aplica a la tarea
2. **Leer el HTML completo** — no asumir, no inventar
3. **Extraer TODOS los tokens** visuales:
   - Colores (hex exactos o clases que los representen)
   - Tipografía: `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`
   - Espaciado: `padding`, `margin`, `gap` — valores exactos
   - Bordes: `border-width`, `border-color`, `border-radius`
   - Sombras: `box-shadow` exacto
   - Transiciones: duración y easing
4. **Registrar** en `src/assets/styles/tokens.css` si la variable no existe aún
5. **Implementar** en `<style scoped>` consumiendo las variables CSS

---

## Variables CSS — única fuente de valores

Todos los valores visuales van en `src/assets/styles/tokens.css`.
Nunca hardcodear en componentes.

```css
/* ✅ CORRECTO — consumir variables */
color: var(--color-primary);
border-radius: var(--radius-md);
padding: var(--space-4) var(--space-6);
box-shadow: var(--shadow-md);
transition: background-color var(--transition-fast);

/* ❌ MAL — valores hardcodeados */
color: #3b82f6;
border-radius: 8px;
padding: 16px 24px;
```

---

## Reglas de estilos en SFC

- Siempre `<style scoped>` — nunca estilos sin scope dentro de un SFC
- Clases en convención **BEM**: `.bloque__elemento--modificador`
- Los estados interactivos son **obligatorios**: `:hover`, `:focus`, `:focus-visible`, `:disabled`, `:active`
- El foco visible nunca debe eliminarse — accesibilidad prioritaria

---

## Accesibilidad mínima obligatoria

| Elemento | Requisito |
|---|---|
| `<input>` | Siempre con `<label>` asociado por `for`/`id` |
| `<button>` | Texto descriptivo o `aria-label` si es solo ícono |
| `<img>` | Atributo `alt` descriptivo (o `alt=""` si es decorativa) |
| Elementos interactivos | Foco visible en todos sin excepción |
| Íconos decorativos | `aria-hidden="true"` |

---

## Cómo agregar una nueva referencia de diseño

1. Guardar el HTML en `docs/design-references/nombre-componente/code.html`
2. Pedirle a Antigravity:
   ```
   Leer docs/design-references/nombre-componente/code.html
   Implementar este componente en Vue 3 con <style scoped>,
   extrayendo todos los valores a tokens.css. No interpretar,
   replicar fielmente.
   ```
3. Verificar que los tokens nuevos se agregaron correctamente a `tokens.css`

---

## Anti-patrones — nunca hacer esto

```css
/* ❌ Hardcodear colores */
color: #3b82f6;

/* ❌ Hardcodear radios, espaciado, sombras */
border-radius: 8px;
padding: 16px;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);

/* ❌ Estilos globales dentro de un SFC */
<style>   /* sin scoped */
```

```vue
<!-- ❌ Usar librerías de componentes no aprobadas -->
import { Button } from 'primevue'
import { NButton } from 'naive-ui'
```
