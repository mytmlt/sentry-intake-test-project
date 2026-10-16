import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchIntakeStatus, runIntake } from '../src/intakeApi.ts'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchIntakeStatus', () => {
  it('requests and returns the intake status', async () => {
    const status = {
      readiness: {
        jira: true,
        jiraAssign: false,
        sentryCapture: true,
        sentryManage: false,
        sentryAssign: false,
      },
      missing: ['JIRA_ASSIGNEE'],
    }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(status),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchIntakeStatus()).resolves.toEqual(status)
    expect(fetchMock).toHaveBeenCalledWith('/api/intake/status')
  })

  it('uses the API error message for a failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Status is unavailable.' }),
      }),
    )

    await expect(fetchIntakeStatus()).rejects.toThrow('Status is unavailable.')
  })

  it('uses the fallback error message when the API omits one', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      }),
    )

    await expect(fetchIntakeStatus()).rejects.toThrow(
      'Could not load intake status.',
    )
  })
})

describe('runIntake', () => {
  it('posts the supplied request and returns the result', async () => {
    const request = {
      kind: 'jira.create' as const,
      labels: ['checkout', 'regression'],
      assignment: 'unassigned' as const,
      summary: 'Checkout regression',
    }
    const result = {
      source: 'jira',
      action: 'created',
      issueKey: 'SHOP-42',
      labels: request.labels,
      assignment: request.assignment,
      seeded: false,
      summary: request.summary,
    }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(result),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(runIntake(request)).resolves.toEqual(result)
    expect(fetchMock).toHaveBeenCalledWith('/api/intake/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
  })

  it('uses the API error message for a failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: 'Request was rejected.' }),
      }),
    )

    await expect(runIntake({ kind: 'status' })).rejects.toThrow(
      'Request was rejected.',
    )
  })

  it('uses the fallback error message when the API omits one', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      }),
    )

    await expect(runIntake({ kind: 'status' })).rejects.toThrow(
      'Intake request failed.',
    )
  })
})
