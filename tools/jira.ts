import { randomUUID } from 'node:crypto'
import type { JiraConfig } from './config.ts'
import { IntakeError } from './errors.ts'
import type { HttpClient } from './http.ts'
import { parseJson, parseJsonSafe } from './http.ts'
import { redactSecrets } from './redact.ts'
import type {
  JiraAssignment,
  JiraCreateInput,
  JiraEventResult,
  JiraUpdateInput,
} from './types.ts'

export type JiraGenerator = {
  create(input: JiraCreateInput): Promise<JiraEventResult>
  update(input: JiraUpdateInput): Promise<JiraEventResult>
}

type JiraIssueFields = {
  summary?: string
  labels?: string[]
  assignee?: { accountId: string } | null
}

function basicAuth(email: string, token: string): string {
  return `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`
}

function adfDescription(text: string): Record<string, unknown> {
  return {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text }],
      },
    ],
  }
}

function buildSummary(
  action: 'created' | 'updated',
  assignment: JiraAssignment,
  labels: string[],
  id: string,
  custom?: string,
): string {
  if (custom?.trim()) {
    return custom.trim()
  }
  const labelPart = labels.length > 0 ? labels.join(',') : 'no-labels'
  return `[intake] ${action} · ${assignment} · ${labelPart} · ${id}`
}

function readIssueKey(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    throw new IntakeError('Jira did not return an issue key.', 502)
  }
  const key = (payload as { key?: unknown }).key
  if (typeof key !== 'string' || key.trim() === '') {
    throw new IntakeError('Jira did not return an issue key.', 502)
  }
  return key
}

function jiraErrorMessage(status: number, body: string): string {
  const payload = parseJsonSafe(body) as {
    errorMessages?: unknown
    errors?: Record<string, unknown>
  } | null
  const messages: string[] = []
  if (Array.isArray(payload?.errorMessages)) {
    for (const item of payload.errorMessages) {
      if (typeof item === 'string' && item.trim() !== '') {
        messages.push(item)
      }
    }
  }
  if (payload?.errors && typeof payload.errors === 'object') {
    for (const [field, value] of Object.entries(payload.errors)) {
      if (typeof value === 'string' && value.trim() !== '') {
        messages.push(`${field}: ${value}`)
      }
    }
  }
  if (messages.length > 0) {
    return `Jira request failed (${status}): ${messages.join('; ')}`
  }
  return `Jira request failed (${status}).`
}

export function createJiraGenerator(
  config: JiraConfig,
  http: HttpClient,
): JiraGenerator {
  const secrets = [config.apiToken]
  const auth = basicAuth(config.email, config.apiToken)

  async function request(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<unknown> {
    const response = await http({
      method,
      url: `${config.baseUrl}${path}`,
      headers: {
        Accept: 'application/json',
        Authorization: auth,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (response.status >= 200 && response.status < 300) {
      return parseJson(response.body)
    }
    throw new IntakeError(
      redactSecrets(jiraErrorMessage(response.status, response.body), secrets),
      response.status >= 400 && response.status < 500 ? response.status : 502,
    )
  }

  function assigneeField(assignment: JiraAssignment): JiraIssueFields['assignee'] {
    if (assignment === 'unassigned') {
      return null
    }
    if (!config.assigneeAccountId) {
      throw new IntakeError(
        'Set JIRA_ASSIGNEE_ACCOUNT_ID to create an assigned Jira issue.',
      )
    }
    return { accountId: config.assigneeAccountId }
  }

  async function createIssue(
    input: JiraCreateInput,
    id: string,
  ): Promise<{ issueKey: string; summary: string; labels: string[] }> {
    const labels = input.labels
    const assignment = input.assignment
    const summary = buildSummary('created', assignment, labels, id, input.summary)
    const fields: Record<string, unknown> = {
      project: { key: config.projectKey },
      issuetype: { name: input.issueType || config.issueType },
      summary,
      labels,
      description: adfDescription(
        'Created by the SuperPlane intake test lab.',
      ),
    }
    if (assignment === 'assigned') {
      fields.assignee = assigneeField(assignment)
    }

    const payload = await request('POST', '/rest/api/3/issue', { fields })
    return { issueKey: readIssueKey(payload), summary, labels }
  }

  return {
    async create(input) {
      const id = randomUUID().slice(0, 8)
      const created = await createIssue(input, id)
      return {
        source: 'jira',
        action: 'created',
        issueKey: created.issueKey,
        labels: created.labels,
        assignment: input.assignment,
        seeded: false,
        summary: created.summary,
      }
    },

    async update(input) {
      const id = randomUUID().slice(0, 8)
      const assignment = input.assignment ?? 'unassigned'
      const labels = input.labels ?? []
      let issueKey = input.issueKey?.trim() ?? ''
      let seeded = false

      if (!issueKey) {
        const seed = await createIssue(
          {
            labels,
            assignment,
            summary: input.summary,
          },
          id,
        )
        issueKey = seed.issueKey
        seeded = true
      }

      const summary = buildSummary(
        'updated',
        assignment,
        labels,
        id,
        input.summary,
      )
      const fields: JiraIssueFields = { summary }
      if (input.labels) {
        fields.labels = labels
      }
      if (input.assignment) {
        fields.assignee = assigneeField(assignment)
      }

      await request(
        'PUT',
        `/rest/api/3/issue/${encodeURIComponent(issueKey)}?notifyUsers=false`,
        { fields },
      )

      return {
        source: 'jira',
        action: 'updated',
        issueKey,
        labels,
        assignment,
        seeded,
        summary,
      }
    },
  }
}
