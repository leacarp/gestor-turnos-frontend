/**
 * Iniciales para los avatares: primera letra del nombre + primera del apellido.
 * "María González" → "MG", "Cher" → "C", vacío o null → "?"
 */
export function getInitials(name?: string | null): string {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'

  const first = words.at(0) ?? ''
  const last = words.length > 1 ? (words.at(-1) ?? '') : ''
  return (first.charAt(0) + last.charAt(0)).toUpperCase()
}
