export function parseApiError(err: unknown, fallback: string): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as { response?: { data?: { message?: string | string[] } } }).response?.data
      ?.message === 'string'
  ) {
    return (err as { response: { data: { message: string } } }).response.data.message
  }
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    Array.isArray(
      (err as { response?: { data?: { message?: string[] } } }).response?.data?.message,
    )
  ) {
    const messages = (err as { response: { data: { message: string[] } } }).response.data.message
    return messages.join('. ')
  }
  return fallback
}
