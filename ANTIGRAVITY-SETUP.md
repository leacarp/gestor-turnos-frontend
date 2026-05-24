# Antigravity Setup — Gestor Turnos Frontend

Guía del sistema de reglas y documentación para maximizar el uso del agente Antigravity.

---

## Cómo funciona este setup

```
.antigravity/rules/     ← Reglas que Antigravity lee al inicio de cada conversación
docs/                   ← Documentación detallada que el agente consulta según la tarea
docs/design-references/ ← HTMLs de referencia visual que el agente replica fielmente
```

### Las reglas (`.antigravity/rules/`)

Antigravity tiene acceso a estas reglas como contexto persistente del proyecto.
Referenciá los archivos relevantes al inicio del chat con `@` para que el agente los cargue.

| Archivo                 | Cuándo usarlo                                           | Qué cubre                                                |
| ----------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| `00-contexto-global.md` | Siempre — inicio de cualquier conversación              | Stack, estructura de carpetas, reglas absolutas          |
| `01-componentes.md`     | Al crear/modificar `src/components/**` o `src/views/**` | Estructura SFC, props, emits, naming, anti-patrones      |
| `02-services-stores.md` | Al crear/modificar `src/services/**` o `src/stores/**`  | Lectura del backend, patrones HTTP, patrones Pinia       |
| `03-estilos.md`         | Al construir UI o modificar `src/assets/styles/**`      | Proceso de replicación visual, tokens CSS, accesibilidad |

### Los HOW-TO (`docs/`)

Documentos detallados con procedimientos completos, ejemplos y anti-patrones.
Referenciarlos con `@` cuando la tarea lo requiera.

| Documento                   | Cuándo leerlo                         |
| --------------------------- | ------------------------------------- |
| `docs/HOW-TO-COMPONENTS.md` | Crear o modificar componentes y views |
| `docs/HOW-TO-SERVICES.md`   | Crear services, stores o tipos        |
| `docs/HOW-TO-STYLES.md`     | Aplicar estilos o construir UI        |
| `docs/HOW-TO-ROUTER.md`     | Crear o modificar rutas y guards      |

---

## Prompts listos para usar con Antigravity

### Crear un componente nuevo

```
@.antigravity/rules/01-componentes.md
@docs/HOW-TO-COMPONENTS.md

Crear el componente TurnoCard que muestra fecha, estado y acciones de un turno.
Props: turno: Turno, isEditable?: boolean
Emits: edit(id: number), cancel(id: number)
```

### Conectar con un endpoint del backend

```
@.antigravity/rules/02-services-stores.md
@docs/HOW-TO-SERVICES.md

Leer ../gestor-turnos-backend/src/turnos/presentation/controllers/turnos.controller.ts
y crear el service y los tipos correspondientes para el módulo de turnos.
```

### Replicar un diseño de referencia

```
@.antigravity/rules/03-estilos.md
@docs/HOW-TO-STYLES.md
@docs/design-references/[carpeta]/code.html

Implementar este componente en Vue 3 con <style scoped>.
Extraer todos los valores visuales nuevos a tokens.css. Replicar fielmente, no interpretar.
```

## Agregar una nueva referencia de diseño

1. Crear la carpeta `docs/design-references/nombre-vista/`
2. Guardar el HTML en `docs/design-references/nombre-vista/code.html`
3. Opcionalmente agregar un `DESIGN.md` con las decisiones visuales del diseño
4. Si hay tokens nuevos (colores, fuentes, sombras), registrarlos en `src/assets/styles/tokens.css`
5. Referenciar en el chat: `@docs/design-references/nombre-vista/code.html`

---

## Variables de entorno necesarias

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Ubicación de los archivos clave

| Archivo                         | Propósito                                                   |
| ------------------------------- | ----------------------------------------------------------- |
| `src/assets/styles/tokens.css`  | Única fuente de verdad de valores visuales                  |
| `src/assets/styles/global.css`  | Estilos globales de reset y tipografía base                 |
| `src/lib/axios.ts`              | Instancia centralizada de Axios                             |
| `src/router/index.ts`           | Rutas de la aplicación                                      |
| `../gestor-turnos-backend/src/` | Backend — leer controllers y DTOs antes de implementar HTTP |
