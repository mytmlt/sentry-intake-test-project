import { describe, expect, it } from 'vitest'
import { parseConfig } from './config.ts'
import { handleIntakeHttp } from './http-api.ts'
import { type IntakeDeps } from './operations.ts'
import type { JiraEventResult } from './types.ts'

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
      data: { readiness: { jira: false, sentryCapture: false } },
    })
  })

  it('returns result for POST /api/intake/run with valid Jira request', async () => {
    const jiraDeps: IntakeDeps = {
      config: parseConfig({
        JIRA_BASE_URL: 'https://example.atlassian.net',
        JIRA_EMAIL: 'dev@example.com',
        JIRA_API_TOKEN: 'jira-secret-token',
        JIRA_PROJECT_KEY: 'SHOP',
      }),
      jira: {
        async create() {
          return {
            source: 'jira',
            action: 'created',
            issueKey: 'SHOP-1',
            labels: ['intake-test'],
            assignment: 'unassigned',
            seeded: false,
            summary: 'created unassigned',
          } satisfies JiraEventResult
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
      jiraDeps,
    )
    expect(result.status).toBe(200)
    expect(result.body).toEqual({
      data: {
        source: 'jira',
        action: 'created',
        issueKey: 'SHOP-1',
        labels: ['intake-test'],
        assignment: 'unassigned',
        seeded: false,
        summary: 'created unassigned',
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
