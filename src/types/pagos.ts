export interface CreatePreferenceDto {
  proveedorId: string
  servicioId: string
  fecha: string
  horaInicio: string
  notas?: string
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
