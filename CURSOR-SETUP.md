# Cursor AI Setup — Gestor Turnos Frontend

Guía del sistema de reglas y documentación para maximizar el uso del agente de Cursor.

---

## Cómo funciona este setup

```
.cursor/rules/          ← Cursor los inyecta automáticamente según contexto
docs/                   ← El agente los lee con @ cuando necesita detalle
docs/design-references/ ← HTMLs de Stitch que el agente replica fielmente
```

### Las reglas (`.cursor/rules/`)
Cursor lee estas reglas automáticamente y las inyecta en el contexto del agente.

| Archivo | Cuándo se activa | Qué hace |
|---------|-----------------|----------|
| `00-always.mdc` | Siempre | Contexto general, stack, estructura, puntero a docs |
| `01-components.mdc` | Al editar `src/components/**` o `src/views/**` | Estándares de SFC, props, emits, naming |
| `02-services.mdc` | Al editar `src/services/**` o `src/stores/**` | Proceso de lectura del backend, patrones HTTP |
| `03-styles.mdc` | Al editar components o assets/styles | Proceso de replicación Stitch, tokens CSS |

### Los HOW-TO (`docs/`)
Documentos detallados con procedimientos, ejemplos y anti-patrones.
El agente los lee cuando la rule lo indica o cuando vos los referencás con `@`.

---

## Cómo trabajar con el agente

### Para crear un componente nuevo
```
@docs/HOW-TO-COMPONENTS.md
Crear el componente TurnoCard que muestra fecha, estado y acciones de un turno.
Props: turno: Turno, isEditable?: boolean
Emits: edit(id), cancel(id)
```

### Para conectar con un endpoint del backend
```
@docs/HOW-TO-SERVICES.md
Leer ../gestor-turnos-backend/src/turnos/presentation/controllers/turnos.controller.ts
y crear el service y los tipos correspondientes para el módulo de turnos.
```

### Para replicar un diseño de Stitch
```
@docs/design-references/button.html @docs/HOW-TO-STYLES.md
Implementar este componente en Vue 3 con <style scoped>.
Extraer todos los valores visuales a tokens.css. Replicar fielmente sin interpretar.
```

### Para crear una view completa
```
@docs/HOW-TO-COMPONENTS.md @docs/HOW-TO-SERVICES.md
Crear TurnosView.vue que liste todos los turnos del usuario autenticado.
Usar useTurnosStore. Mostrar estado de loading y error.
```

---

## Agregar un HTML de Stitch

1. Guardar el archivo en `docs/design-references/nombre.html`
2. Si tiene tokens nuevos (colores, fuentes), agregarlos a `src/assets/styles/tokens.css`
3. Referenciar en el chat: `@docs/design-references/nombre.html`

---

## Variables de entorno necesarias

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
```
