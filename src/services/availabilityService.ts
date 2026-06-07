import { apiClient } from '@/lib/axios'
import type {
  WeeklyScheduleRequestDto,
  WeeklyScheduleResponseDto,
} from '@/types/availability'

export const availabilityService = {
  getSchedule: () =>
    apiClient.get<WeeklyScheduleResponseDto>('/availability/schedule'),

  createSchedule: (dto: WeeklyScheduleRequestDto) =>
    apiClient.post<WeeklyScheduleResponseDto>('/availability/schedule', dto),

  updateSchedule: (dto: WeeklyScheduleRequestDto) =>
    apiClient.put<WeeklyScheduleResponseDto>('/availability/schedule', dto),
}
