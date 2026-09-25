import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchIntakeStatus, runIntake } from './intakeApi.ts'

describe('fetchIntakeStatus', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the status payload on success', async () => {
    const payload = {
      readiness: {
        jira: true,
        jiraAssign: false,
        sentryCapture: true,
        sentryManage: false,
        sentryAssign: false,
      },
      missing: ['JIRA_ASSIGNEE_ACCOUNT_ID'],
    }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response)

    const result = await fetchIntakeStatus()
    expect(result).toEqual(payload)
    expect(fetch).toHaveBeenCalledWith('/api/intake/status')
  })

  it('throws on a non-ok response with the error message', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Server misconfigured.' }),
    } as Response)

    await expect(fetchIntakeStatus()).rejects.toThrow('Server misconfigured.')
  })

  it('uses a fallback message when the error field is missing', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    await expect(fetchIntakeStatus()).rejects.toThrow(
      'Could not load intake status.',
    )
  })
})

describe('runIntake', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts the request and returns the result', async () => {
    const result = {
      source: 'jira' as const,
      action: 'created' as const,
      issueKey: 'SHOP-1',
      labels: ['intake-test'],
      assignment: 'unassigned' as const,
      seeded: false,
      summary: '[intake] created',
    }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => result,
    } as Response)

    const request = {
      kind: 'jira.create' as const,
      labels: ['intake-test'],
      assignment: 'unassigned' as const,
    }
    const response = await runIntake(request)
    expect(response).toEqual(result)
    expect(fetch).toHaveBeenCalledWith('/api/intake/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
  })

  it('throws on a non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Jira not configured.' }),
    } as Response)

    await expect(
      runIntake({
        kind: 'jira.create',
        labels: [],
        assignment: 'unassigned',
      }),
    ).rejects.toThrow('Jira not configured.')
  })

  it('uses a fallback message when the error field is missing', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    await expect(
      runIntake({ kind: 'status' }),
    ).rejects.toThrow('Intake request failed.')
  })
})
