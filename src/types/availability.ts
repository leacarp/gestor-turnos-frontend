// Espeja ../gestor-turnos-backend/src/availability/presentation/dto/

export interface DaySlotDto {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export interface WeeklyScheduleDto {
  slots: DaySlotDto[]
}

export interface WeeklyScheduleResponse {
  id: string
  providerId: string
  slots: DaySlotDto[]
  createdAt: string
  updatedAt: string
}

export interface AvailableSlot {
  startTime: string
  endTime: string
}
