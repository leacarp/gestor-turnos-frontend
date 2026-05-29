export interface ServiceFormFields {
  title: string
  category: string
  description: string
  duration: number | string
  price: number | string
}

export function validateServiceForm(fields: ServiceFormFields): string | null {
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

  return null
}

export function isServiceFormValid(fields: ServiceFormFields): boolean {
  return validateServiceForm(fields) === null
}
