import { randomUUID } from 'node:crypto'
import * as Sentry from '@sentry/node'
import type { SentryConfig } from './config.ts'
import { IntakeError } from './errors.ts'
import type { HttpClient } from './http.ts'
import { parseJsonSafe } from './http.ts'
import { redactSecrets } from './redact.ts'
import type { Clock } from './retry.ts'
import { RetryableError, retry } from './retry.ts'
import type {
  SentryAction,
  SentryEventInput,
  SentryEventResult,
  SentryLevel,
} from './types.ts'

export type CaptureEvent = {
  message: string
  level: SentryLevel
  fingerprint: string[]
  tags: Record<string, string>
}

export type EventCapture = (event: CaptureEvent) => Promise<string>

export type SentryGenerator = {
  create(input: SentryEventInput): Promise<SentryEventResult>
  regress(input: SentryEventInput): Promise<SentryEventResult>
  assign(input: SentryEventInput): Promise<SentryEventResult>
}

let sentryInitializedForDsn = ''

export function createSdkCapture(dsn: string): EventCapture {
  return async (event) => {
    if (!dsn) {
      throw new IntakeError(
        'Set SENTRY_DSN or VITE_SENTRY_DSN to capture a Sentry event.',
      )
    }
    if (sentryInitializedForDsn !== dsn) {
      Sentry.init({
        dsn,
        enabled: true,
        tracesSampleRate: 0,
        defaultIntegrations: false,
        integrations: [],
        environment: 'intake-lab',
      })
      sentryInitializedForDsn = dsn
    }

    const eventId = Sentry.withScope((scope) => {
      scope.setLevel(event.level)
      scope.setFingerprint(event.fingerprint)
      for (const [key, value] of Object.entries(event.tags)) {
        scope.setTag(key, value)
      }
      const error = new Error(event.message)
      error.name = 'IntakeTestError'
      return Sentry.captureException(error)
    })

    const flushed = await Sentry.flush(5000)
    if (!flushed) {
      throw new IntakeError('Sentry did not flush the captured event.', 502)
    }
    if (!eventId) {
      throw new IntakeError('Sentry did not return an event id.', 502)
    }
    return eventId
  }
}

function issueIdFromPayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    throw new IntakeError('Sentry event did not include a group id.', 502)
  }
  const object = payload as Record<string, unknown>
  for (const key of ['groupId', 'groupID']) {
    const value = object[key]
    if (typeof value === 'string' && value !== '') {
      return value
    }
    if (typeof value === 'number') {
      return String(value)
    }
  }
  const event = object.event
  if (event && typeof event === 'object') {
    return issueIdFromPayload(event)
  }
  throw new IntakeError('Sentry event did not include a group id.', 502)
}

function shortIdFromPayload(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') {
    return undefined
  }
  const shortId = (payload as { shortId?: unknown }).shortId
  return typeof shortId === 'string' && shortId !== '' ? shortId : undefined
}

function sentryErrorMessage(status: number, body: string): string {
  const payload = parseJsonSafe(body) as { detail?: unknown } | null
  if (typeof payload?.detail === 'string' && payload.detail.trim() !== '') {
    return `Sentry request failed (${status}): ${payload.detail}`
  }
  return `Sentry request failed (${status}).`
}

export function createSentryGenerator(options: {
  config: SentryConfig
  http: HttpClient
  capture: EventCapture
  clock: Clock
  lookupAttempts?: number
}): SentryGenerator {
  const { config, http, capture, clock } = options
  const lookupAttempts = options.lookupAttempts ?? 10
  const secrets = [config.authToken, config.dsn]

  async function api(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<{ status: number; payload: unknown }> {
    const response = await http({
      method,
      url: `${config.apiBaseUrl}${path}`,
      headers: {
        Authorization: `Bearer ${config.authToken}`,
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const payload =
      response.body.trim() === '' ? null : parseJsonSafe(response.body)
    if (response.status >= 200 && response.status < 300) {
      if (payload === null && response.body.trim() !== '') {
        throw new IntakeError('Upstream returned invalid JSON.', 502)
      }
      return { status: response.status, payload }
    }
    const error = new IntakeError(
      redactSecrets(sentryErrorMessage(response.status, response.body), secrets),
      response.status >= 400 && response.status < 500 ? response.status : 502,
    )
    if (response.status === 404 || response.status === 429) {
      throw new RetryableError(error.message)
    }
    throw error
  }

  async function lookupIssue(eventId: string): Promise<{
    issueId: string
    shortId?: string
  }> {
    if (!config.authToken || !config.org) {
      return { issueId: '' }
    }

    const issueId = await retry(
      async () => {
        try {
          const byOrg = await api(
            'GET',
            `/api/0/organizations/${encodeURIComponent(config.org)}/eventids/${eventId}/`,
          )
          return issueIdFromPayload(byOrg.payload)
        } catch (error) {
          if (!config.project || !(error instanceof RetryableError)) {
            throw error
          }
          const byProject = await api(
            'GET',
            `/api/0/projects/${encodeURIComponent(config.org)}/${encodeURIComponent(config.project)}/events/${eventId}/`,
          )
          return issueIdFromPayload(byProject.payload)
        }
      },
      {
        attempts: lookupAttempts,
        delayMs: 400,
        clock,
        shouldRetry: (error) => error instanceof RetryableError,
      },
    )

    let shortId: string | undefined
    try {
      const issue = await api(
        'GET',
        `/api/0/organizations/${encodeURIComponent(config.org)}/issues/${issueId}/`,
      )
      shortId = shortIdFromPayload(issue.payload)
    } catch {
      shortId = undefined
    }

    return { issueId, shortId }
  }

  async function captureEvent(
    action: SentryAction,
    input: SentryEventInput,
  ): Promise<{ eventId: string; fingerprintId: string; message: string }> {
    const fingerprintId = input.fingerprintId ?? randomUUID().slice(0, 8)
    const message =
      input.message ??
      `Harbor intake ${action} ${input.level} (${fingerprintId})`
    const eventId = await capture({
      message,
      level: input.level,
      fingerprint: ['harbor-intake', fingerprintId],
      tags: {
        intake_action: action,
        intake_level: input.level,
      },
    })
    return { eventId, fingerprintId, message }
  }

  async function createWithLookup(
    action: SentryAction,
    input: SentryEventInput,
  ): Promise<SentryEventResult> {
    if (!config.dsn) {
      throw new IntakeError(
        'Set SENTRY_DSN or VITE_SENTRY_DSN to capture a Sentry event.',
      )
    }
    const captured = await captureEvent(action, input)
    const lookedUp = await lookupIssue(captured.eventId).catch((error) => {
      if (action === 'created' && !config.authToken) {
        return { issueId: '', shortId: undefined }
      }
      throw error
    })

    const result: SentryEventResult = {
      source: 'sentry',
      action,
      level: input.level,
      fingerprintId: captured.fingerprintId,
      eventIds: [captured.eventId],
    }
    if (lookedUp.issueId) {
      result.issueId = lookedUp.issueId
    }
    if (lookedUp.shortId) {
      result.shortId = lookedUp.shortId
    }
    return result
  }

  return {
    async create(input) {
      return createWithLookup('created', input)
    },

    async regress(input) {
      if (!config.authToken) {
        throw new IntakeError(
          'Set SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT to regress a Sentry issue.',
        )
      }
      const created = await createWithLookup('created', input)
      if (!created.issueId) {
        throw new IntakeError(
          'Could not resolve the Sentry issue id after capture.',
          502,
        )
      }
      await api(
        'PUT',
        `/api/0/organizations/${encodeURIComponent(config.org)}/issues/${created.issueId}/`,
        { status: 'resolved' },
      )
      await clock.sleep(1000)
      const recaptured = await captureEvent('unresolved', {
        ...input,
        fingerprintId: created.fingerprintId,
      })
      const lookedUp = await lookupIssue(recaptured.eventId)
      return {
        source: 'sentry',
        action: 'unresolved',
        level: input.level,
        fingerprintId: created.fingerprintId,
        eventIds: [...created.eventIds, recaptured.eventId],
        issueId: lookedUp.issueId || created.issueId,
        shortId: lookedUp.shortId || created.shortId,
      }
    },

    async assign(input) {
      if (!config.authToken) {
        throw new IntakeError(
          'Set SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT to assign a Sentry issue.',
        )
      }
      if (!config.assignee) {
        throw new IntakeError(
          'Set SENTRY_ASSIGNEE to assign a Sentry issue.',
        )
      }
      const created = await createWithLookup('created', input)
      if (!created.issueId) {
        throw new IntakeError(
          'Could not resolve the Sentry issue id after capture.',
          502,
        )
      }
      await api(
        'PUT',
        `/api/0/organizations/${encodeURIComponent(config.org)}/issues/${created.issueId}/`,
        { assignedTo: config.assignee },
      )
      return {
        source: 'sentry',
        action: 'assigned',
        level: input.level,
        fingerprintId: created.fingerprintId,
        eventIds: created.eventIds,
        issueId: created.issueId,
        shortId: created.shortId,
        assignedTo: config.assignee,
      }
    },
  }
}
