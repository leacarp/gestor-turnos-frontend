import { apiClient } from '@/lib/axios'
import type { User } from '@/types/user'

export const userService = {
  getMe: () =>
    apiClient.get<User>('/users/me'),
}

