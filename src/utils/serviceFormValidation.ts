export interface ServiceFormFields {
  title: string
  category: string
  description: string
  duration: number | string
  price: number | string
}

export function validateServiceForm(fields: ServiceFormFields, depositPercent?: number): string | null {
  if (!fields.title.trim()) {
    return 'El nombre del servicio es obligatorio'
  }
  if (!fields.category.trim()) {
    return 'La categoría es obligatoria'
  }
  if (!fields.description.trim()) {
    return 'La descripción es obligatoria'
  }

  const duration = Number(fields.duration)
  if (!Number.isFinite(duration) || duration < 1) {
    return 'La duración debe ser al menos 1 minuto'
  }

  const price = Number(fields.price)
  if (!Number.isFinite(price) || price <= 0) {
    return 'El precio debe ser mayor a 0'
  }

  if (depositPercent != null && depositPercent > 0) {
    if (price < depositPercent) {
      return `El precio del servicio debe ser igual o mayor al de la seña ($${depositPercent.toLocaleString('es-AR')})`
    }
  }

  return null
}

export function isServiceFormValid(fields: ServiceFormFields, depositPercent?: number): boolean {
  return validateServiceForm(fields, depositPercent) === null
}
