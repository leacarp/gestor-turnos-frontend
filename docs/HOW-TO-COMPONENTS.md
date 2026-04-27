# HOW-TO: Componentes Vue 3

Manual de procedimientos para crear componentes en este proyecto.

---

## 1. Antes de escribir código — preguntas a responder

- ¿Es reutilizable? → va en `src/components/`
- ¿Es una página completa? → va en `src/views/`
- ¿Es un layout (sidebar, header)? → va en `src/layouts/`
- ¿La lógica se puede extraer? → crear un composable en `src/composables/`

---

## 2. Template de componente completo

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTurnosStore } from '@/stores/useTurnosStore'
import type { Turno } from '@/types/turno'

// Props tipadas — siempre con genérico
const props = defineProps<{
  turno: Turno
  isEditable?: boolean
}>()

// Emits tipados
const emit = defineEmits<{
  edit: [id: number]
  delete: [id: number]
}>()

// Estado local
const isExpanded = ref(false)

// Computed
const formattedDate = computed(() =>
  new Date(props.turno.fecha).toLocaleDateString('es-AR')
)

// Handlers — prefijo handle
function handleEdit() {
  emit('edit', props.turno.id)
}

function handleDelete() {
  emit('delete', props.turno.id)
}
</script>

<template>
  <article class="turno-card" :class="{ 'turno-card--expanded': isExpanded }">
    <header class="turno-card__header">
      <span class="turno-card__date">{{ formattedDate }}</span>
      <span class="turno-card__status" :data-status="turno.estado">
        {{ turno.estado }}
      </span>
    </header>

    <div v-if="isEditable" class="turno-card__actions">
      <button type="button" @click="handleEdit">Editar</button>
      <button type="button" @click="handleDelete">Eliminar</button>
    </div>
  </article>
</template>

<style scoped>
.turno-card {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: box-shadow var(--transition-base);
}

.turno-card:hover {
  box-shadow: var(--shadow-md);
}

.turno-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

/* BEM para clases — .bloque__elemento--modificador */
</style>
```

---

## 3. Composables — extraer lógica reutilizable

```typescript
// src/composables/useTurnos.ts
import { ref } from 'vue'
import { turnosService } from '@/services/turnosService'
import type { Turno } from '@/types/turno'

export function useTurnos() {
  const turnos = ref<Turno[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTurnos() {
    isLoading.value = true
    try {
      const { data } = await turnosService.getAll()
      turnos.value = data
    } catch {
      error.value = 'No se pudieron cargar los turnos'
    } finally {
      isLoading.value = false
    }
  }

  return { turnos, isLoading, error, fetchTurnos }
}
```

---

## 4. Convenciones de naming

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | PascalCase | `TurnoCard.vue` |
| Views | PascalCase + View | `TurnosView.vue` |
| Composables | camelCase + use | `useTurnos.ts` |
| Stores | camelCase + use + Store | `useTurnosStore.ts` |
| Clases CSS | BEM | `.turno-card__header` |
| Handlers | prefijo handle | `handleEdit()` |
| Booleans | prefijo is/has/can | `isLoading`, `hasError` |

---

## 5. Anti-patrones — nunca hacer esto

```vue
<!-- MAL: prop sin tipo -->
defineProps(['turno'])

<!-- MAL: mutación directa de prop -->
props.turno.estado = 'cancelado'  // ← nunca mutar props

<!-- MAL: v-if con v-for en el mismo elemento -->
<li v-for="t in turnos" v-if="t.activo">  <!-- usar computed para filtrar -->

<!-- MAL: key con index -->
<TurnoCard v-for="(t, i) in turnos" :key="i" />
```
