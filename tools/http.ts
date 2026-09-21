import { IntakeError } from './errors.ts'
import { hostOf } from './redact.ts'

export type HttpRequest = {
  method: string
  url: string
  headers?: Record<string, string>
  body?: string
}

export type HttpResponse = {
  status: number
  body: string
}

export type HttpClient = (request: HttpRequest) => Promise<HttpResponse>

export function createFetchHttpClient(): HttpClient {
  return async (request) => {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      })
      return { status: response.status, body: await response.text() }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new IntakeError(
        `Request to ${hostOf(request.url)} failed: ${message}`,
        502,
      )
    }
  }
}

export function parseJson(body: string): unknown {
  if (body.trim() === '') {
    return null
  }
  try {
    return JSON.parse(body)
  } catch {
    throw new IntakeError('Upstream returned invalid JSON.', 502)
  }
}

export function parseJsonSafe(body: string): unknown {
  try {
    return parseJson(body)
  } catch {
    return null
  }
}
