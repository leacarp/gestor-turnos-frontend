# Regla 01 — Componentes y Views Vue 3
> Aplica a: `src/components/**/*.vue`, `src/views/**/*.vue`, `src/layouts/**/*.vue`
> Leer `docs/HOW-TO-COMPONENTS.md` antes de crear o modificar cualquier componente.

---

## ¿Dónde va cada archivo?

| Pregunta | Destino |
|---|---|
| ¿Es reutilizable en más de una vista? | `src/components/NombreComponente.vue` |
| ¿Es una página completa (una ruta)? | `src/views/NombreView.vue` |
| ¿Es un layout (sidebar, header)? | `src/layouts/NombreLayout.vue` |
| ¿La lógica se puede extraer y reusar? | `src/composables/useNombre.ts` |

---

## Estructura obligatoria de un SFC

```vue
<script setup lang="ts">
// 1. Imports externos (vue, vue-router, pinia)
// 2. Imports internos (composables, stores, services, types)
// 3. Props y emits
// 4. Estado reactivo (ref, computed)
// 5. Lógica / lifecycle hooks (onMounted, watch)
// 6. Handlers de eventos (prefijo handle)
</script>

<template>
  <!-- Un único elemento raíz en componentes -->
  <!-- Múltiples elementos raíz en views está permitido -->
</template>

<style scoped>
/* Siempre scoped. Nunca estilos globales dentro de un SFC. */
/* Usar BEM: .bloque__elemento--modificador */
</style>
```

---

## Props — siempre tipadas con genérico

```typescript
// ✅ CORRECTO
const props = defineProps<{
  turno: Turno
  isLoading?: boolean
}>()

// ❌ MAL — nunca sin tipos
defineProps(['turno', 'isLoading'])
```

---

## Emits — siempre tipados

```typescript
const emit = defineEmits<{
  confirm: [turnoId: number]
  cancel: []
  update: [value: string]
}>()
```

---

## Naming — convenciones obligatorias

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `TurnoCard.vue`, `AppButton.vue` |
| Views | PascalCase + sufijo `View` | `TurnosView.vue`, `LoginView.vue` |
| Layouts | PascalCase + sufijo `Layout` | `DashboardLayout.vue` |
| Composables | camelCase + prefijo `use` | `useTurnos.ts` |
| Stores | camelCase + prefijo `use` + sufijo `Store` | `useTurnosStore.ts` |
| Clases CSS | BEM | `.turno-card__header--active` |
| Handlers | prefijo `handle` | `handleEdit()`, `handleDelete()` |
| Booleans | prefijo `is` / `has` / `can` | `isLoading`, `hasError` |

---

## v-for — siempre con `:key` significativa

```html
<!-- ✅ CORRECTO -->
<TurnoCard v-for="turno in turnos" :key="turno.id" :turno="turno" />

<!-- ❌ MAL — key con índice -->
<TurnoCard v-for="(turno, index) in turnos" :key="index" />
```

---

## Anti-patrones — nunca hacer esto

```vue
<!-- ❌ Mutar una prop directamente -->
props.turno.estado = 'cancelado'

<!-- ❌ v-if y v-for en el mismo elemento — usar computed para filtrar -->
<li v-for="t in turnos" v-if="t.activo">

<!-- ❌ any en TypeScript -->
const data: any = await fetchData()

<!-- ❌ Lógica compleja inline en el template — extraer a computed o handler -->
<button @click="turnos = turnos.filter(t => t.id !== id)">
```
