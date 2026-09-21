import { describe, expect, it } from 'vitest'
import type { HttpClient, HttpRequest, HttpResponse } from './http.ts'
import { instantClock } from './retry.ts'
import { createSentryGenerator, type CaptureEvent, type EventCapture } from './sentry.ts'

const sentryConfig = {
  dsn: 'https://abc@o0.ingest.sentry.io/1',
  authToken: 'sentry-secret-token',
  org: 'acme',
  project: 'harbor-shop',
  assignee: 'dev@example.com',
  apiBaseUrl: 'https://sentry.io',
}

function recordingCapture(): EventCapture & { events: CaptureEvent[] } {
  const events: CaptureEvent[] = []
  const capture: EventCapture = async (event) => {
    events.push(event)
    return `evt-${events.length}`
  }
  return Object.assign(capture, { events })
}

function scriptedHttp(
  handler: (request: HttpRequest, calls: HttpRequest[]) => HttpResponse,
): HttpClient & { calls: HttpRequest[] } {
  const calls: HttpRequest[] = []
  const client: HttpClient = async (request) => {
    calls.push(request)
    return handler(request, calls)
  }
  return Object.assign(client, { calls })
}

describe('createSentryGenerator', () => {
  it('captures a created issue at the requested level and fingerprint', async () => {
    const capture = recordingCapture()
    const http = scriptedHttp((request) => {
      if (request.url.includes('/eventids/')) {
        return {
          status: 200,
          body: JSON.stringify({ groupId: '99' }),
        }
      }
      if (request.url.includes('/issues/99/')) {
        return {
          status: 200,
          body: JSON.stringify({ shortId: 'HARBOR-SHOP-99' }),
        }
      }
      throw new Error(`Unexpected ${request.method} ${request.url}`)
    })
    const sentry = createSentryGenerator({
      config: sentryConfig,
      http,
      capture,
      clock: instantClock,
    })

    const result = await sentry.create({ level: 'warning' })
    expect(result.action).toBe('created')
    expect(result.level).toBe('warning')
    expect(result.issueId).toBe('99')
    expect(result.shortId).toBe('HARBOR-SHOP-99')
    expect(capture.events[0]?.level).toBe('warning')
    expect(capture.events[0]?.fingerprint[0]).toBe('harbor-intake')
    expect(capture.events[0]?.fingerprint[1]).toBe(result.fingerprintId)
  })

  it('retries event lookup after 404 then resolves and recaptures for regression', async () => {
    const capture = recordingCapture()
    let eventLookups = 0
    const http = scriptedHttp((request) => {
      if (request.url.includes('/eventids/')) {
        eventLookups += 1
        if (eventLookups === 1) {
          return { status: 404, body: 'not ready' }
        }
        return { status: 200, body: JSON.stringify({ groupId: '12' }) }
      }
      if (request.url.includes('/events/')) {
        return { status: 404, body: 'not ready' }
      }
      if (request.method === 'GET' && request.url.includes('/issues/12/')) {
        return { status: 200, body: JSON.stringify({ shortId: 'HARBOR-12' }) }
      }
      if (request.method === 'PUT' && request.url.includes('/issues/12/')) {
        return { status: 200, body: JSON.stringify({ status: 'resolved' }) }
      }
      throw new Error(`Unexpected ${request.method} ${request.url}`)
    })
    const sentry = createSentryGenerator({
      config: sentryConfig,
      http,
      capture,
      clock: instantClock,
      lookupAttempts: 4,
    })

    const result = await sentry.regress({ level: 'fatal' })
    expect(result.action).toBe('unresolved')
    expect(result.level).toBe('fatal')
    expect(result.eventIds).toEqual(['evt-1', 'evt-2'])
    expect(capture.events).toHaveLength(2)
    expect(capture.events[0]?.fingerprint).toEqual(capture.events[1]?.fingerprint)
    const resolveCall = http.calls.find(
      (call) => call.method === 'PUT' && call.url.includes('/issues/12/'),
    )
    expect(JSON.parse(resolveCall?.body ?? '{}')).toEqual({
      status: 'resolved',
    })
    expect(eventLookups).toBeGreaterThan(1)
  })

  it('assigns the created issue through the Sentry API', async () => {
    const capture = recordingCapture()
    const http = scriptedHttp((request) => {
      if (request.url.includes('/eventids/')) {
        return { status: 200, body: JSON.stringify({ groupId: '44' }) }
      }
      if (request.method === 'GET' && request.url.includes('/issues/44/')) {
        return { status: 200, body: JSON.stringify({ shortId: 'HARBOR-44' }) }
      }
      if (request.method === 'PUT') {
        return { status: 200, body: JSON.stringify({ assignedTo: 'dev@example.com' }) }
      }
      throw new Error(`Unexpected ${request.method} ${request.url}`)
    })
    const sentry = createSentryGenerator({
      config: sentryConfig,
      http,
      capture,
      clock: instantClock,
    })

    const result = await sentry.assign({ level: 'error' })
    expect(result.action).toBe('assigned')
    expect(result.assignedTo).toBe('dev@example.com')
    const assignCall = http.calls.find((call) => call.method === 'PUT')
    expect(JSON.parse(assignCall?.body ?? '{}')).toEqual({
      assignedTo: 'dev@example.com',
    })
    expect(assignCall?.headers?.Authorization).toBe('Bearer sentry-secret-token')
  })

  it('redacts the auth token from Sentry error messages', async () => {
    const capture = recordingCapture()
    const http = scriptedHttp(() => ({
      status: 401,
      body: JSON.stringify({ detail: 'bad sentry-secret-token' }),
    }))
    const sentry = createSentryGenerator({
      config: sentryConfig,
      http,
      capture,
      clock: instantClock,
      lookupAttempts: 1,
    })
    await expect(sentry.create({ level: 'error' })).rejects.toThrow('bad ***')
  })
})
