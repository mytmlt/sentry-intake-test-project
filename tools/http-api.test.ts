import { describe, expect, it } from 'vitest'
import { parseConfig } from './config.ts'
import { handleIntakeHttp } from './http-api.ts'
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
    expect(result.status).toBe(200)
    expect(result.body).toEqual({ error: 'failed with ***' })
  })

  it('returns 200 for invalid JSON', async () => {
    const result = await handleIntakeHttp(
      'POST',
      '/api/intake/run',
      'not-json',
      emptyDeps,
    )
    expect(result.status).toBe(200)
    expect(result.body).toEqual({ error: 'Request body must be JSON.' })
  })

  it('returns 200 for missing-configuration IntakeError', async () => {
    const deps: IntakeDeps = {
      ...emptyDeps,
      config: parseConfig({}),
      jira: {
        async create() {
          throw new Error('not used')
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
    )
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({ error: expect.any(String) })
  })

  it('returns 200 for a mocked upstream failure', async () => {
    const deps: IntakeDeps = {
      ...emptyDeps,
      config: parseConfig({
        JIRA_BASE_URL: 'https://example.atlassian.net',
        JIRA_EMAIL: 'dev@example.com',
        JIRA_API_TOKEN: 'fake-token',
        JIRA_PROJECT_KEY: 'SHOP',
      }),
      jira: {
        async create() {
          throw new Error('upstream exploded')
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
    )
    expect(result.status).toBe(200)
    expect(result.body).toEqual({ error: 'upstream exploded' })
  })
})
