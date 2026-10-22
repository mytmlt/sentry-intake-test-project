import { describe, expect, it } from 'vitest'
import {
  handleWebhook,
  parseJiraWebhook,
  parseSentryWebhook,
} from './webhook.ts'

describe('parseSentryWebhook', () => {
  it('parses a created event', () => {
    const parsed = parseSentryWebhook(
      JSON.stringify({
        action: 'created',
        level: 'error',
        issueId: '42',
        shortId: 'HARBOR-42',
        message: 'Test issue',
        timestamp: '2026-01-01T00:00:00Z',
      }),
    )
    expect(parsed.action).toBe('created')
    expect(parsed.level).toBe('error')
    expect(parsed.issueId).toBe('42')
    expect(parsed.shortId).toBe('HARBOR-42')
    expect(parsed.message).toBe('Test issue')
    expect(parsed.timestamp).toBe('2026-01-01T00:00:00Z')
  })

  it('parses an unresolved event', () => {
    const parsed = parseSentryWebhook(
      JSON.stringify({ action: 'unresolved', issueId: '7' }),
    )
    expect(parsed.action).toBe('unresolved')
    expect(parsed.issueId).toBe('7')
  })

  it('parses an assigned event', () => {
    const parsed = parseSentryWebhook(
      JSON.stringify({ action: 'assigned', issueId: '12' }),
    )
    expect(parsed.action).toBe('assigned')
    expect(parsed.issueId).toBe('12')
  })

  it('accepts minimal payload with only action', () => {
    const parsed = parseSentryWebhook(JSON.stringify({ action: 'created' }))
    expect(parsed.action).toBe('created')
    expect(parsed.level).toBeUndefined()
    expect(parsed.issueId).toBeUndefined()
    expect(parsed.shortId).toBeUndefined()
  })

  it('rejects invalid JSON', () => {
    expect(() => parseSentryWebhook('not json')).toThrow(
      'Invalid JSON in Sentry webhook payload.',
    )
  })

  it('rejects non-object JSON', () => {
    expect(() => parseSentryWebhook('"string"')).toThrow(
      'Sentry webhook payload must be a JSON object.',
    )
  })

  it('rejects payloads without action', () => {
    expect(() => parseSentryWebhook(JSON.stringify({}))).toThrow(
      'Sentry webhook payload must include action.',
    )
  })

  it('rejects unknown actions', () => {
    expect(() =>
      parseSentryWebhook(JSON.stringify({ action: 'unknown' })),
    ).toThrow('Unknown Sentry action: unknown')
  })
})

describe('parseJiraWebhook', () => {
  it('parses an issue created event', () => {
    const parsed = parseJiraWebhook(
      JSON.stringify({
        event: 'issue_created',
        issueKey: 'SHOP-42',
        labels: ['intake-test'],
        assignment: 'unassigned',
        summary: 'Test issue',
        timestamp: '2026-01-01T00:00:00Z',
      }),
    )
    expect(parsed.event).toBe('issue_created')
    expect(parsed.issueKey).toBe('SHOP-42')
    expect(parsed.labels).toEqual(['intake-test'])
    expect(parsed.assignment).toBe('unassigned')
    expect(parsed.summary).toBe('Test issue')
    expect(parsed.timestamp).toBe('2026-01-01T00:00:00Z')
  })

  it('parses an issue updated event', () => {
    const parsed = parseJiraWebhook(
      JSON.stringify({
        event: 'issue_updated',
        issueKey: 'SHOP-7',
        assignment: 'assigned',
      }),
    )
    expect(parsed.event).toBe('issue_updated')
    expect(parsed.issueKey).toBe('SHOP-7')
    expect(parsed.assignment).toBe('assigned')
  })

  it('accepts minimal payload with only event', () => {
    const parsed = parseJiraWebhook(JSON.stringify({ event: 'issue_created' }))
    expect(parsed.event).toBe('issue_created')
    expect(parsed.issueKey).toBeUndefined()
    expect(parsed.labels).toBeUndefined()
  })

  it('rejects invalid JSON', () => {
    expect(() => parseJiraWebhook('not json')).toThrow(
      'Invalid JSON in Jira webhook payload.',
    )
  })

  it('rejects non-object JSON', () => {
    expect(() => parseJiraWebhook('"string"')).toThrow(
      'Jira webhook payload must be a JSON object.',
    )
  })

  it('rejects payloads without event', () => {
    expect(() => parseJiraWebhook(JSON.stringify({}))).toThrow(
      'Jira webhook payload must include event.',
    )
  })
})

describe('handleWebhook', () => {
  it('returns a webhook result for a valid Sentry payload', () => {
    const result = handleWebhook(
      'sentry',
      JSON.stringify({ action: 'created', level: 'error' }),
    )
    expect(result.source).toBe('sentry')
    expect(result.event).toBe('issue.created')
    expect((result.parsed as { action: string }).action).toBe('created')
    expect((result.parsed as { level?: string }).level).toBe('error')
    expect(typeof result.receivedAt).toBe('string')
  })

  it('maps Sentry unresolved to issue.resolved', () => {
    const result = handleWebhook(
      'sentry',
      JSON.stringify({ action: 'unresolved' }),
    )
    expect(result.event).toBe('issue.resolved')
  })

  it('maps Sentry assigned to issue.assigned', () => {
    const result = handleWebhook(
      'sentry',
      JSON.stringify({ action: 'assigned' }),
    )
    expect(result.event).toBe('issue.assigned')
  })

  it('returns a webhook result for a valid Jira payload', () => {
    const result = handleWebhook(
      'jira',
      JSON.stringify({ event: 'issue_created', issueKey: 'SHOP-1' }),
    )
    expect(result.source).toBe('jira')
    expect(result.event).toBe('issue.created')
    expect((result.parsed as { event: string }).event).toBe('issue_created')
    expect((result.parsed as { issueKey?: string }).issueKey).toBe('SHOP-1')
    expect(typeof result.receivedAt).toBe('string')
  })

  it('maps Jira issue_updated to issue.updated', () => {
    const result = handleWebhook(
      'jira',
      JSON.stringify({ event: 'issue_updated' }),
    )
    expect(result.event).toBe('issue.updated')
  })

  it('rejects an unknown webhook source', () => {
    expect(() =>
      handleWebhook('unknown' as 'sentry', '{}'),
    ).toThrow('Unknown webhook source: unknown')
  })
})