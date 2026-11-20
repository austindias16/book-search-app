import { ACCEPT_JSON_HEADERS, STRINGS } from '@/constants'

export class ApiError extends Error {
  #status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.#status = status
  }

  get status(): number {
    return this.#status
  }
}

export async function getJson(url: URL, signal?: AbortSignal): Promise<unknown> {
  const res = await fetch(url, { signal, headers: ACCEPT_JSON_HEADERS })
  if (!res.ok) {
    throw new ApiError(res.status, STRINGS.errors.httpStatus(res.status))
  }
  return res.json()
}
