import { IntakeError, isIntakeError } from './errors.ts'
import { executeIntake, type IntakeDeps } from './operations.ts'
import { redactSecrets } from './redact.ts'
import type { IntakeRequest } from './types.ts'
import { isSentryLevel } from './types.ts'

export type HttpApiResult = {
  status: number
  body: unknown
}

function jsonError(status: number, message: string): HttpApiResult {
  return { status, body: { error: message } }
}

function parseRequest(path: string, method: string, raw: string): IntakeRequest {
  if (method === 'GET' && path === '/api/intake/status') {
    return { kind: 'status' }
  }
  if (method !== 'POST' || path !== '/api/intake/run') {
    throw new IntakeError('Not found.', 404)
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new IntakeError('Request body must be JSON.')
  }
  if (!parsed || typeof parsed !== 'object' || !('kind' in parsed)) {
    throw new IntakeError('Request must include kind.')
  }
  const request = parsed as IntakeRequest
  if (
    (request.kind === 'sentry.create' ||
      request.kind === 'sentry.unresolved' ||
      request.kind === 'sentry.assigned') &&
    !isSentryLevel(request.level)
  ) {
    throw new IntakeError('Level must be fatal, error, warning, info, or debug.')
  }
  return request
}

export async function handleIntakeHttp(
  method: string,
  path: string,
  rawBody: string,
  deps: IntakeDeps,
  secrets: string[] = [],
): Promise<HttpApiResult> {
  try {
    const request = parseRequest(path, method, rawBody)
    const body = await executeIntake(request, deps)
    return { status: 200, body }
  } catch (error) {
    const message = redactSecrets(
      error instanceof Error ? error.message : String(error),
      secrets,
    )
    const status = isIntakeError(error) ? error.statusCode : 500
    return jsonError(status, message)
  }
}
