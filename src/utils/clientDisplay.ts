/** Fecha corta para las cards de cliente: "04/08/26". Sin fecha → "—" */
export function fechaCorta(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

/**
 * Los turnos de invitado pueden llegar sin teléfono o sin nombre. Mostramos un
 * guion en lugar de un hueco vacío.
 */
export function oGuion(value: string | null | undefined): string {
  const trimmed = (value ?? '').trim()
  return trimmed === '' ? '—' : trimmed
}
