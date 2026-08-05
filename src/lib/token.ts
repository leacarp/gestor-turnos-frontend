export const AUTH_TOKEN_KEY = 'auth_token'

/** Margen para no dejar pasar un token que vence en el próximo segundo. */
const SKEW_SECONDS = 10

interface JwtPayload {
  exp?: number
}

/**
 * Decodifica el payload de un JWT sin validar la firma.
 * Solo para UX: la validación real la hace el backend en cada request.
 */
export function decodeJwt(token: string): JwtPayload | null {
  const parts = token.split('.')
  const payload = parts.length === 3 ? parts[1] : undefined
  if (!payload) return null

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as JwtPayload
  } catch {
    return null
  }
}

/**
 * Un token que no se puede decodificar o que no trae `exp` se considera vencido:
 * ante la duda preferimos mandar a login antes que mostrar una vista rota.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload || typeof payload.exp !== 'number') return true
  return payload.exp * 1000 <= Date.now() + SKEW_SECONDS * 1000
}

/** El token guardado, o null si no hay o ya venció. */
export function getValidToken(): string | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) return null
  return isTokenExpired(token) ? null : token
}

/** True si hay un token guardado pero vencido (para diferenciar el mensaje de login). */
export function hasExpiredToken(): boolean {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  return token !== null && isTokenExpired(token)
}

export function clearToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}
