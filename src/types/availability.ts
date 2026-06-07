// Espeja ../gestor-turnos-backend/src/availability/presentation/dto/

export interface DaySlotDto {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export interface WeeklyScheduleRequestDto {
  slots: DaySlotDto[]
}

export interface WeeklyScheduleResponseDto {
  id: string
  providerId: string
  slots: DaySlotDto[]
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
