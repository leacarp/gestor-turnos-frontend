export interface ServiceFormFields {
  title: string
  category: string
  description: string
  duration: number | string
  price: number | string
  requiereSeña: boolean
  montoSeña: number | string
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

  if (fields.requiereSeña) {
    const monto = Number(fields.montoSeña)
    if (!Number.isFinite(monto) || monto <= 0) {
      return 'El monto de la seña debe ser mayor a 0'
    }
    if (monto > price) {
      return 'El monto de la seña no puede ser mayor al precio del servicio'
    }
  }

  return null
}

export function isServiceFormValid(fields: ServiceFormFields): boolean {
  return validateServiceForm(fields) === null
}
