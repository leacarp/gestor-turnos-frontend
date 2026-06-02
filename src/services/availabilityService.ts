import { apiClient } from '@/lib/axios'
import type { AvailableSlot, WeeklyScheduleDto, WeeklyScheduleResponse } from '@/types/availability'

export const availabilityService = {
  createSchedule: (dto: WeeklyScheduleDto) =>
    apiClient.post<WeeklyScheduleResponse>('/availability/schedule', dto),

  updateSchedule: (dto: WeeklyScheduleDto) =>
    apiClient.put<WeeklyScheduleResponse>('/availability/schedule', dto),

  getAvailableSlots: (providerId: string, serviceId: string, date: string) =>
    apiClient.get<AvailableSlot[]>(`/availability/slots/${providerId}`, {
      params: {
        date,
        servicioId: serviceId,
      },
    }),
}
