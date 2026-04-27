import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TimeRange {
  start: string
  end: string
}

export interface ScheduleDay {
  id: number
  dayName: string
  isActive: boolean
  timeRanges: TimeRange[]
}

export const useOnboardingStore = defineStore('onboarding', () => {
  const role = ref<'proveedor' | 'cliente'>('proveedor')

  const identity = ref({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  })
  
  const business = ref({
    nombre: '',
    categoria: '',
    redSocial: '',
    direccion: ''
  })

  const schedule = ref<ScheduleDay[]>([
    { id: 1, dayName: 'Lunes', isActive: true, timeRanges: [{ start: '09:00', end: '18:00' }] },
    { id: 2, dayName: 'Martes', isActive: true, timeRanges: [{ start: '09:00', end: '18:00' }] },
    { id: 3, dayName: 'Miércoles', isActive: true, timeRanges: [{ start: '09:00', end: '18:00' }] },
    { id: 4, dayName: 'Jueves', isActive: true, timeRanges: [{ start: '09:00', end: '18:00' }] },
    { id: 5, dayName: 'Viernes', isActive: true, timeRanges: [{ start: '09:00', end: '18:00' }] },
    { id: 6, dayName: 'Sábado', isActive: false, timeRanges: [{ start: '09:00', end: '13:00' }] },
    { id: 0, dayName: 'Domingo', isActive: false, timeRanges: [{ start: '09:00', end: '13:00' }] },
  ])

  return {
    role,
    identity,
    business,
    schedule
  }
})
