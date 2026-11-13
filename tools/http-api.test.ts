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
  it('returns status wrapped in data for GET /api/intake/status', async () => {
    const result = await handleIntakeHttp(
      'GET',
      '/api/intake/status',
      '',
      emptyDeps,
    )
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({
      data: { readiness: { jira: false, sentryCapture: false } },
    })
  })

  it('returns run result wrapped in data for POST /api/intake/run', async () => {
    const deps: IntakeDeps = {
      config: parseConfig({
        JIRA_BASE_URL: 'https://example.atlassian.net',
        JIRA_EMAIL: 'dev@example.com',
        JIRA_API_TOKEN: 't',
        JIRA_PROJECT_KEY: 'SHOP',
        JIRA_ISSUE_TYPE: 'Task',
      }),
      jira: {
        async create(request) {
          return {
            source: 'jira',
            action: 'created',
            issueKey: 'SHOP-42',
            url: 'https://example.atlassian.net/browse/SHOP-42',
            summary: `Intake: ${request.labels?.join(', ')}`,
            labels: request.labels ?? [],
            assignment: request.assignment,
            seeded: false,
          }
        },
        async update() {
          throw new Error('not used')
        },
      },
      sentry: {
        async create() {
          throw new Error('not used')
        },
        async regress() {
          throw new Error('not used')
        },
        async assign() {
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
    expect(result.body).toEqual({
      data: {
        source: 'jira',
        action: 'created',
        issueKey: 'SHOP-42',
        url: 'https://example.atlassian.net/browse/SHOP-42',
        summary: 'Intake: intake-test',
        labels: ['intake-test'],
        assignment: 'unassigned',
        seeded: false,
      },
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