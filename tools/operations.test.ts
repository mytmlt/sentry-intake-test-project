import { describe, expect, it } from 'vitest'
import { parseConfig } from './config.ts'
import type { JiraGenerator } from './jira.ts'
import { executeIntake, type IntakeDeps } from './operations.ts'
import type { SentryGenerator } from './sentry.ts'
import type { JiraEventResult, SentryEventResult } from './types.ts'

function jiraResult(
  action: JiraEventResult['action'],
  assignment: JiraEventResult['assignment'],
  labels: string[],
): JiraEventResult {
  return {
    source: 'jira',
    action,
    issueKey: 'SHOP-1',
    labels,
    assignment,
    seeded: action === 'updated',
    summary: `${action} ${assignment}`,
  }
}

function sentryResult(
  action: SentryEventResult['action'],
  level: SentryEventResult['level'],
): SentryEventResult {
  return {
    source: 'sentry',
    action,
    level,
    fingerprintId: 'abcd',
    eventIds: ['evt-1'],
    issueId: '1',
  }
}

function recordingDeps(env: Record<string, string | undefined>): {
  deps: IntakeDeps
  jiraCalls: string[]
  sentryCalls: string[]
} {
  const jiraCalls: string[] = []
  const sentryCalls: string[] = []
  const jira: JiraGenerator = {
    async create(input) {
      jiraCalls.push(`create:${input.assignment}:${input.labels.join(',')}`)
      return jiraResult('created', input.assignment, input.labels)
    },
    async update(input) {
      const assignment = input.assignment ?? 'unassigned'
      const labels = input.labels ?? []
      jiraCalls.push(`update:${assignment}:${labels.join(',')}`)
      return jiraResult('updated', assignment, labels)
    },
  }
  const sentry: SentryGenerator = {
    async create(input) {
      sentryCalls.push(`create:${input.level}`)
      return sentryResult('created', input.level)
    },
    async regress(input) {
      sentryCalls.push(`regress:${input.level}`)
      return sentryResult('unresolved', input.level)
    },
    async assign(input) {
      sentryCalls.push(`assign:${input.level}`)
      return sentryResult('assigned', input.level)
    },
  }
  return {
    deps: { config: parseConfig(env), jira, sentry },
    jiraCalls,
    sentryCalls,
  }
}

const fullEnv = {
  JIRA_BASE_URL: 'https://example.atlassian.net',
  JIRA_EMAIL: 'dev@example.com',
  JIRA_API_TOKEN: 'jira-secret-token',
  JIRA_PROJECT_KEY: 'SHOP',
  JIRA_ASSIGNEE_ACCOUNT_ID: 'account-123',
  SENTRY_DSN: 'https://abc@o0.ingest.sentry.io/1',
  SENTRY_AUTH_TOKEN: 'sentry-secret-token',
  SENTRY_ORG: 'acme',
  SENTRY_PROJECT: 'harbor-shop',
  SENTRY_ASSIGNEE: 'dev@example.com',
}

describe('executeIntake', () => {
  it('returns readiness without calling generators', async () => {
    const { deps, jiraCalls } = recordingDeps(fullEnv)
    const result = await executeIntake({ kind: 'status' }, deps)
    expect(result).toMatchObject({
      readiness: {
        jira: true,
        sentryCapture: true,
        sentryManage: true,
        sentryAssign: true,
      },
    })
    expect(jiraCalls).toEqual([])
  })

  it('runs the full matrix when credentials are present', async () => {
    const { deps, jiraCalls, sentryCalls } = recordingDeps(fullEnv)
    const result = await executeIntake({ kind: 'matrix', source: 'all' }, deps)
    expect(result).toMatchObject({ source: 'all', skipped: [] })
    if (!('results' in result)) {
      throw new Error('expected matrix result')
    }
    expect(result.results).toHaveLength(23)
    expect(jiraCalls).toHaveLength(8)
    expect(sentryCalls).toHaveLength(15)
  })

  it('skips assigned Jira cells when the assignee is missing', async () => {
    const env = { ...fullEnv, JIRA_ASSIGNEE_ACCOUNT_ID: '' }
    const { deps, jiraCalls } = recordingDeps(env)
    const result = await executeIntake({ kind: 'matrix', source: 'jira' }, deps)
    if (!('skipped' in result)) {
      throw new Error('expected matrix result')
    }
    expect(jiraCalls).toHaveLength(4)
    expect(result.skipped.some((item) => item.reason.includes('assignee'))).toBe(
      true,
    )
  })

  it('rejects Jira create when Jira is not configured', async () => {
    const { deps } = recordingDeps({})
    await expect(
      executeIntake(
        {
          kind: 'jira.create',
          labels: ['intake-test'],
          assignment: 'unassigned',
        },
        deps,
      ),
    ).rejects.toThrow('JIRA_BASE_URL')
  })
})
