// src/types/pagos.ts
// Configuración de seña del proveedor — se almacena en providerData.minimumAdvance del usuario
// Espeja PUT /users/me → body.providerData.minimumAdvance

/**
 * DTO para actualizar el monto de seña del proveedor.
 * Se envía como PATCH de providerData dentro de PUT /users/me
 */
export interface UpdateMinimumAdvanceDto {
  providerData: {
    minimumAdvance: number
  }
}

export interface CreatePreferenceDto {
  proveedorId: string
  servicioId: string
  fecha: string
  horaInicio: string
}

export interface CreateGuestPreferenceDto extends CreatePreferenceDto {
  guestDetails: {
    nombre: string
    email: string
    celular: string
  }
}

export interface PreferenceResponse {
  initPoint: string
}
