import { IntakeError, isIntakeError } from './errors.ts'
import { executeIntake, type IntakeDeps } from './operations.ts'
import { redactSecrets } from './redact.ts'
import type { IntakeRequest } from './types.ts'
import { isSentryLevel } from './types.ts'
import { handleWebhook } from './webhook.ts'

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

function parseWebhookPath(path: string): 'sentry' | 'jira' | null {
  if (path === '/api/webhook/sentry') return 'sentry'
  if (path === '/api/webhook/jira') return 'jira'
  return null
}

export async function handleWebhookHttp(
  method: string,
  path: string,
  rawBody: string,
): Promise<HttpApiResult> {
  if (method !== 'POST') {
    return jsonError(405, 'Webhook endpoint requires POST.')
  }
  const source = parseWebhookPath(path)
  if (!source) {
    return jsonError(404, 'Not found.')
  }
  try {
    const body = handleWebhook(source, rawBody)
    return { status: 200, body }
  } catch (error) {
    if (isIntakeError(error)) {
      return jsonError(error.statusCode, error.message)
    }
    return jsonError(400, error instanceof Error ? error.message : String(error))
  }
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
