import { IntakeError } from './errors.ts'
import type { SentryAction } from './types.ts'

export type WebhookSource = 'sentry' | 'jira'
export type WebhookEventType = 'issue.created' | 'issue.resolved' | 'issue.assigned' | 'issue.updated'

export type SentryWebhookPayload = {
  action: SentryAction
  level?: string
  issueId?: string
  shortId?: string
  message?: string
  timestamp?: string
}

export type JiraWebhookPayload = {
  event: string
  issueKey?: string
  labels?: string[]
  assignment?: string
  summary?: string
  timestamp?: string
}

export type WebhookResult = {
  source: WebhookSource
  event: WebhookEventType
  receivedAt: string
  parsed: SentryWebhookPayload | JiraWebhookPayload
}

export function parseSentryWebhook(raw: string): SentryWebhookPayload {
  let payload: unknown
  try {
    payload = JSON.parse(raw)
  } catch {
    throw new IntakeError('Invalid JSON in Sentry webhook payload.')
  }
  if (!payload || typeof payload !== 'object') {
    throw new IntakeError('Sentry webhook payload must be a JSON object.')
  }
  const data = payload as Record<string, unknown>
  const action = String(data.action ?? '')
  if (!action) {
    throw new IntakeError('Sentry webhook payload must include action.')
  }
  if (action !== 'created' && action !== 'unresolved' && action !== 'assigned') {
    throw new IntakeError(`Unknown Sentry action: ${action}`)
  }
  const level = typeof data.level === 'string' ? data.level : undefined
  const issueId = typeof data.issueId === 'string' ? data.issueId : undefined
  const shortId = typeof data.shortId === 'string' ? data.shortId : undefined
  const message = typeof data.message === 'string' ? data.message : undefined
  const timestamp = typeof data.timestamp === 'string' ? data.timestamp : undefined
  return { action, level, issueId, shortId, message, timestamp }
}

export function parseJiraWebhook(raw: string): JiraWebhookPayload {
  let payload: unknown
  try {
    payload = JSON.parse(raw)
  } catch {
    throw new IntakeError('Invalid JSON in Jira webhook payload.')
  }
  if (!payload || typeof payload !== 'object') {
    throw new IntakeError('Jira webhook payload must be a JSON object.')
  }
  const data = payload as Record<string, unknown>
  const event = String(data.event ?? '')
  if (!event) {
    throw new IntakeError('Jira webhook payload must include event.')
  }
  const issueKey = typeof data.issueKey === 'string' ? data.issueKey : undefined
  const labels = Array.isArray(data.labels) ? data.labels.filter((l): l is string => typeof l === 'string') : undefined
  const assignment = typeof data.assignment === 'string' ? data.assignment : undefined
  const summary = typeof data.summary === 'string' ? data.summary : undefined
  const timestamp = typeof data.timestamp === 'string' ? data.timestamp : undefined
  return { event, issueKey, labels, assignment, summary, timestamp }
}

export function handleWebhook(
  source: WebhookSource,
  rawBody: string,
): WebhookResult {
  const receivedAt = new Date().toISOString()

  if (source === 'sentry') {
    const parsed = parseSentryWebhook(rawBody)
    const action = parsed.action
    const event: WebhookEventType =
      action === 'assigned' ? 'issue.assigned' :
      action === 'unresolved' ? 'issue.resolved' :
      'issue.created'
    return { source, event, receivedAt, parsed }
  }

  if (source === 'jira') {
    const parsed = parseJiraWebhook(rawBody)
    const event: WebhookEventType =
      parsed.event === 'issue_created' ? 'issue.created' :
      parsed.event === 'issue_updated' ? 'issue.updated' :
      'issue.updated'
    return { source, event, receivedAt, parsed }
  }

  throw new IntakeError(`Unknown webhook source: ${source}`)
}