import { describe, expect, it } from 'vitest'
import { parseConfig } from './config.ts'
import { handleIntakeHttp, handleWebhookHttp } from './http-api.ts'
import type { IntakeDeps } from './operations.ts'

const emptyDeps = {
  config: parseConfig({}),
  jira: {
    create: async () => {
      throw new Error('not used')
    },
    update: async () => {
      throw new Error('not used')
    },
  },
  sentry: {
    create: async () => {
      throw new Error('not used')
    },
    regress: async () => {
      throw new Error('not used')
    },
    assign: async () => {
      throw new Error('not used')
    },
  },
} satisfies IntakeDeps

describe('handleIntakeHttp', () => {
  it('returns status for GET /api/intake/status', async () => {
    const result = await handleIntakeHttp(
      'GET',
      '/api/intake/status',
      '',
      emptyDeps,
    )
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({
      readiness: { jira: false, sentryCapture: false },
    })
  })

  it('redacts secrets from errors', async () => {
    const deps: IntakeDeps = {
      ...emptyDeps,
      config: parseConfig({
        JIRA_BASE_URL: 'https://example.atlassian.net',
        JIRA_EMAIL: 'dev@example.com',
        JIRA_API_TOKEN: 'jira-secret-token',
        JIRA_PROJECT_KEY: 'SHOP',
      }),
      jira: {
        async create() {
          throw new Error('failed with jira-secret-token')
        },
        async update() {
          throw new Error('not used')
        },
      },
    }
    const result = await handleIntakeHttp(
      'POST',
      '/api/intake/run',
      JSON.stringify({
        kind: 'jira.create',
        labels: ['intake-test'],
        assignment: 'unassigned',
      }),
      deps,
      ['jira-secret-token'],
    )
    expect(result.status).toBe(500)
    expect(result.body).toEqual({ error: 'failed with ***' })
  })
})

describe('handleWebhookHttp', () => {
  it('accepts a Sentry webhook POST and returns the parsed result', async () => {
    const result = await handleWebhookHttp(
      'POST',
      '/api/webhook/sentry',
      JSON.stringify({ action: 'created', level: 'error' }),
    )
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({
      source: 'sentry',
      event: 'issue.created',
    })
  })

  it('accepts a Jira webhook POST and returns the parsed result', async () => {
    const result = await handleWebhookHttp(
      'POST',
      '/api/webhook/jira',
      JSON.stringify({ event: 'issue_created', issueKey: 'SHOP-1' }),
    )
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({
      source: 'jira',
      event: 'issue.created',
    })
  })

  it('rejects GET on webhook endpoints', async () => {
    const result = await handleWebhookHttp('GET', '/api/webhook/sentry', '')
    expect(result.status).toBe(405)
    expect(result.body).toEqual({ error: 'Webhook endpoint requires POST.' })
  })

  it('rejects unknown webhook paths', async () => {
    const result = await handleWebhookHttp('POST', '/api/webhook/unknown', '{}')
    expect(result.status).toBe(404)
    expect(result.body).toEqual({ error: 'Not found.' })
  })

  it('rejects invalid Sentry webhook payload', async () => {
    const result = await handleWebhookHttp(
      'POST',
      '/api/webhook/sentry',
      'not json',
    )
    expect(result.status).toBe(400)
    expect(result.body).toMatchObject({
      error: 'Invalid JSON in Sentry webhook payload.',
    })
  })

  it('rejects invalid Jira webhook payload', async () => {
    const result = await handleWebhookHttp(
      'POST',
      '/api/webhook/jira',
      JSON.stringify({}),
    )
    expect(result.status).toBe(400)
    expect(result.body).toMatchObject({
      error: 'Jira webhook payload must include event.',
    })
  })
})
