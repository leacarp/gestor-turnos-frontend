// Espeja ../gestor-turnos-backend/src/availability/presentation/dto/

export interface DaySlotDto {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export interface WeeklyScheduleRequestDto {
  slots: DaySlotDto[]
  appointmentGap?: number
}

export interface WeeklyScheduleResponseDto {
  id: string
  providerId: string
  slots: DaySlotDto[]
  appointmentGap: number
  createdAt: string
  updatedAt: string
}

export type WeeklyScheduleDto = WeeklyScheduleRequestDto
export type WeeklyScheduleResponse = WeeklyScheduleResponseDto

export interface AvailabilityState {
  schedule: WeeklyScheduleResponseDto | null
  slots: DaySlotDto[]
  hasSchedule: boolean
}

export interface AvailabilityExceptionRequestDto {
  date: string
  type: 'day_off' | 'custom_hours'
  customSlots?: { startTime: string; endTime: string }[]
  reason?: string
}

export interface AvailabilityExceptionResponseDto {
  id: string
  providerId: string
  date: string
  type: 'day_off' | 'custom_hours'
  customSlots?: { startTime: string; endTime: string }[]
  reason?: string
  createdAt: string
  updatedAt: string
}
