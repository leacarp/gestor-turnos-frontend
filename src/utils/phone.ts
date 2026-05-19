/** Deja solo dígitos — el backend exige al menos 11 */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function isValidPhone(phone: string): boolean {
  return normalizePhone(phone).length >= 11
}
