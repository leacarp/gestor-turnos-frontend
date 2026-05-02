# Regla 00 — Contexto Global del Proyecto
> Siempre activa. Leer antes de cualquier tarea.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 con Composition API (`<script setup lang="ts">`) |
| Bundler | Vite |
| Lenguaje | TypeScript estricto — nunca `any` |
| State | Pinia (`defineStore` con Setup Store) |
| Routing | Vue Router 4 |
| HTTP | Axios — instancia centralizada en `src/lib/axios.ts` |
| Estilos | Vanilla CSS con variables en `src/assets/styles/tokens.css` |

---

## Estructura de `src/`

```
src/
├── assets/
│   └── styles/
│       ├── tokens.css        ← ÚNICA fuente de verdad de valores visuales
│       └── global.css
├── components/               ← componentes reutilizables (PascalCase)
├── composables/              ← lógica extraída (useXxx.ts)
├── layouts/                  ← layouts de página (AuthLayout, DashboardLayout)
├── router/
│   └── index.ts
├── services/                 ← llamadas HTTP agrupadas por dominio
├── stores/                   ← stores Pinia (useXxxStore.ts)
├── types/                    ← interfaces TypeScript, espejando DTOs del backend
└── views/                    ← páginas completas, una por ruta (XxxView.vue)
```

---

## Documentación del proyecto — leer antes de implementar

| Tarea | Documento obligatorio |
|---|---|
| Crear/modificar componentes o views | `docs/HOW-TO-COMPONENTS.md` |
| Crear/modificar services o stores | `docs/HOW-TO-SERVICES.md` |
| Aplicar estilos o construir UI | `docs/HOW-TO-STYLES.md` |
| Crear/modificar rutas o guards | `docs/HOW-TO-ROUTER.md` |

---

## Reglas absolutas — nunca violar

1. **TypeScript**: Prohibido usar `any`. Si el tipo es desconocido → `unknown`.
2. **Endpoints**: Nunca inventar rutas. Leer el backend antes de cualquier llamada HTTP.
3. **Backend**: ubicado en `../gestor-turnos-backend/src/`. Consultar controllers y DTOs.
4. **Props**: siempre tipadas con `defineProps<{}>()`.
5. **Variables**: preferir `const`. Prohibido `var`. Usar `let` solo cuando sea estrictamente necesario.
6. **Estilos**: nunca hardcodear valores visuales. Siempre usar variables de `tokens.css`.
7. **Librerías UI**: prohibido Tailwind, Vuetify, PrimeVue o similares salvo indicación explícita.
