import { apiClient } from '@/lib/axios'
import type { WeeklyScheduleDto, WeeklyScheduleResponse } from '@/types/availability'

export const availabilityService = {
  createSchedule: (dto: WeeklyScheduleDto) =>
    apiClient.post<WeeklyScheduleResponse>('/availability/schedule', dto),

  updateSchedule: (dto: WeeklyScheduleDto) =>
    apiClient.put<WeeklyScheduleResponse>('/availability/schedule', dto),
}
