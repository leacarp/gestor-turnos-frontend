import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { RegisterDto, ProviderDataDto, UserRole } from '@/types/auth'
import type { DaySlotDto } from '@/types/availability'
import { normalizePhone } from '@/utils/phone'

export interface IdentityData {
  name: string
  email: string
  phone: string
  password: string
}

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

export type AdvanceType = 'amount'

export const useOnboardingStore = defineStore('onboarding', () => {
  const role = ref<UserRole>('provider')

  const identity = reactive<IdentityData>({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  /** Snapshot al avanzar de identity — evita perder la contraseña al desmontar el paso */
  const savedIdentity = ref<IdentityData | null>(null)

  const business = reactive({
    publicInfo: '',
    serviceType: '',
    address: '',
    instagramUrl: '',
    tiktokUrl: '',
    servicePrice: '' as string | number,
  })

  const advance = ref({
    enabled: false,
    type: 'amount' as AdvanceType,
    value: 0,
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

  function getIdentityData(): IdentityData {
    return savedIdentity.value ?? identity
  }

  function saveIdentitySnapshot() {
    savedIdentity.value = {
      name: identity.name.trim(),
      email: identity.email.trim(),
      phone: normalizePhone(identity.phone),
      password: identity.password,
    }
  }

  function getServicePrice(): number {
    return Number(business.servicePrice) || 0
  }

  /** Monto calculado para vista previa en onboarding */
  function getAdvanceAmount(): number | undefined {
    if (!advance.value.enabled || advance.value.value <= 0) return undefined
    return advance.value.value
  }

  /** Valor persistido en minimumAdvance: monto fijo */
  function getMinimumAdvanceForStorage(): number | undefined {
    if (!advance.value.enabled || advance.value.value <= 0) return undefined
    return advance.value.value
  }

  function validateAdvance(): string | null {
    if (!advance.value.enabled || advance.value.value <= 0) return null

    const basePrice = getServicePrice()
    if (basePrice <= 0) {
      return 'Ingresá un precio de referencia para configurar la seña.'
    }

    if (advance.value.value > basePrice) {
      return 'La seña no puede ser mayor al precio del servicio.'
    }

    return null
  }

  function buildRegisterDto(): RegisterDto {
    const id = getIdentityData()
    const dto: RegisterDto = {
      name: id.name.trim(),
      email: id.email.trim(),
      phone: normalizePhone(id.phone),
      password: id.password,
      role: role.value,
    }

    if (role.value === 'provider') {
      const socialMedia: ProviderDataDto['socialMedia'] = []
      const instagram = business.instagramUrl.trim()
      const tiktok = business.tiktokUrl.trim()

      if (instagram) {
        socialMedia.push({ platform: 'instagram', url: instagram })
      }
      if (tiktok) {
        socialMedia.push({ platform: 'tiktok', url: tiktok })
      }

      const providerData: ProviderDataDto = {
        address: business.address.trim(),
        serviceType: business.serviceType,
        publicInfo: business.publicInfo.trim() || undefined,
        socialMedia: socialMedia.length > 0 ? socialMedia : undefined,
      }

      const minimumAdvance = getMinimumAdvanceForStorage()
      if (minimumAdvance !== undefined) {
        providerData.minimumAdvance = minimumAdvance
      }

      dto.providerData = providerData
    }

    return dto
  }

  function buildWeeklyScheduleSlots(): DaySlotDto[] {
    const slots: DaySlotDto[] = []

    for (const day of schedule.value) {
      if (!day.isActive) {
        slots.push({
          dayOfWeek: day.id,
          startTime: day.timeRanges[0]?.start ?? '09:00',
          endTime: day.timeRanges[0]?.end ?? '18:00',
          isActive: false,
        })
        continue
      }

      for (const range of day.timeRanges) {
        slots.push({
          dayOfWeek: day.id,
          startTime: range.start,
          endTime: range.end,
          isActive: true,
        })
      }
    }

    return slots
  }

  return {
    role,
    identity,
    savedIdentity,
    business,
    advance,
    schedule,
    saveIdentitySnapshot,
    getIdentityData,
    validateAdvance,
    getServicePrice,
    buildRegisterDto,
    buildWeeklyScheduleSlots,
  }
})
