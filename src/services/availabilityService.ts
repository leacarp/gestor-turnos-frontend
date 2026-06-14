import { apiClient } from '@/lib/axios'
import type {
  WeeklyScheduleRequestDto,
  WeeklyScheduleResponseDto,
  AvailabilityExceptionRequestDto,
  AvailabilityExceptionResponseDto,
} from '@/types/availability'

export const availabilityService = {
  getSchedule: () =>
    apiClient.get<WeeklyScheduleResponseDto>('/availability/schedule'),

  createSchedule: (dto: WeeklyScheduleRequestDto) =>
    apiClient.post<WeeklyScheduleResponseDto>('/availability/schedule', dto),

  updateSchedule: (dto: WeeklyScheduleRequestDto) =>
    apiClient.put<WeeklyScheduleResponseDto>('/availability/schedule', dto),

  createException: (dto: AvailabilityExceptionRequestDto) =>
    apiClient.post<AvailabilityExceptionResponseDto>('/availability/exceptions', dto),

  getExceptionsByMonth: (year: number, month: number) =>
    apiClient.get<AvailabilityExceptionResponseDto[]>('/availability/exceptions', {
      params: { year, month },
    }),

  deleteException: (exceptionId: string) =>
    apiClient.delete(`/availability/exceptions/${exceptionId}`),
}
