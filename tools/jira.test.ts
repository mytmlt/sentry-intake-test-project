import { describe, expect, it } from 'vitest'
import type { HttpClient, HttpRequest, HttpResponse } from './http.ts'
import { createJiraGenerator } from './jira.ts'

const jiraConfig = {
  baseUrl: 'https://example.atlassian.net',
  email: 'dev@example.com',
  apiToken: 'jira-secret-token',
  projectKey: 'SHOP',
  issueType: 'Task',
  assigneeAccountId: 'account-123',
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

function jsonBody(request: HttpRequest): Record<string, unknown> {
  return JSON.parse(request.body ?? '{}') as Record<string, unknown>
}

describe('createJiraGenerator', () => {
  it('creates an assigned issue with labels', async () => {
    const http = scriptedHttp(() => ({
      status: 201,
      body: JSON.stringify({ key: 'SHOP-41' }),
    }))
    const jira = createJiraGenerator(jiraConfig, http)
    const result = await jira.create({
      labels: ['intake-test'],
      assignment: 'assigned',
    })

    expect(result.issueKey).toBe('SHOP-41')
    expect(result.action).toBe('created')
    expect(result.seeded).toBe(false)
    expect(http.calls).toHaveLength(1)
    expect(http.calls[0].method).toBe('POST')
    expect(http.calls[0].url).toBe(
      'https://example.atlassian.net/rest/api/3/issue',
    )
    expect(http.calls[0].headers?.Authorization).toMatch(/^Basic /)
    const body = jsonBody(http.calls[0])
    const fields = body.fields as Record<string, unknown>
    expect(fields.project).toEqual({ key: 'SHOP' })
    expect(fields.issuetype).toEqual({ name: 'Task' })
    expect(fields.labels).toEqual(['intake-test'])
    expect(fields.assignee).toEqual({ accountId: 'account-123' })
  })

  it('omits assignee when the issue is unassigned', async () => {
    const http = scriptedHttp(() => ({
      status: 201,
      body: JSON.stringify({ key: 'SHOP-42' }),
    }))
    const jira = createJiraGenerator(jiraConfig, http)
    await jira.create({ labels: [], assignment: 'unassigned' })
    const fields = jsonBody(http.calls[0]).fields as Record<string, unknown>
    expect(fields.assignee).toBeUndefined()
    expect(fields.labels).toEqual([])
  })

  it('seeds then updates when no issue key is given', async () => {
    const http = scriptedHttp((request) => {
      if (request.method === 'POST') {
        return { status: 201, body: JSON.stringify({ key: 'SHOP-9' }) }
      }
      return { status: 204, body: '' }
    })
    const jira = createJiraGenerator(jiraConfig, http)
    const result = await jira.update({
      labels: ['intake-test'],
      assignment: 'unassigned',
    })

    expect(result.action).toBe('updated')
    expect(result.issueKey).toBe('SHOP-9')
    expect(result.seeded).toBe(true)
    expect(http.calls.map((call) => call.method)).toEqual(['POST', 'PUT'])
    expect(http.calls[1].url).toContain('/rest/api/3/issue/SHOP-9')
    const updateFields = jsonBody(http.calls[1]).fields as Record<string, unknown>
    expect(updateFields.assignee).toBeNull()
    expect(updateFields.labels).toEqual(['intake-test'])
    expect(String(updateFields.summary)).toContain('updated')
  })

  it('updates an existing issue key without a seed create', async () => {
    const http = scriptedHttp(() => ({ status: 204, body: '' }))
    const jira = createJiraGenerator(jiraConfig, http)
    const result = await jira.update({
      issueKey: 'SHOP-7',
      assignment: 'assigned',
      labels: ['factory'],
    })
    expect(result.seeded).toBe(false)
    expect(http.calls).toHaveLength(1)
    expect(http.calls[0].method).toBe('PUT')
    expect(http.calls[0].url).toContain('/rest/api/3/issue/SHOP-7')
  })

  it('redacts the API token from Jira error messages', async () => {
    const http = scriptedHttp(() => ({
      status: 401,
      body: JSON.stringify({
        errorMessages: ['bad jira-secret-token'],
      }),
    }))
    const jira = createJiraGenerator(jiraConfig, http)
    await expect(
      jira.create({ labels: ['intake-test'], assignment: 'unassigned' }),
    ).rejects.toThrow('bad ***')
  })
})
