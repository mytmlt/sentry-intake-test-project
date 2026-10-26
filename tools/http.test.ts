import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createFetchHttpClient,
  parseJson,
  parseJsonSafe,
} from './http.ts'
import { IntakeError } from './errors.ts'

describe('parseJson', () => {
  it('returns null for an empty string', () => {
    expect(parseJson('')).toBeNull()
  })

  it('returns null for whitespace-only string', () => {
    expect(parseJson('   ')).toBeNull()
  })

  it('parses valid JSON', () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 })
  })

  it('throws IntakeError for invalid JSON', () => {
    let error: unknown
    try {
      parseJson('nope')
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(IntakeError)
    expect((error as IntakeError).message).toBe(
      'Upstream returned invalid JSON.',
    )
    expect((error as IntakeError).statusCode).toBe(502)
  })
})

describe('parseJsonSafe', () => {
  it('returns null for invalid JSON', () => {
    expect(parseJsonSafe('nope')).toBeNull()
  })
})

describe('createFetchHttpClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns status and body from fetch', async () => {
    const mockFetch = vi.mocked(globalThis.fetch)
    mockFetch.mockResolvedValue({
      status: 200,
      text: async () => 'ok',
    } as Response)

    const client = createFetchHttpClient()
    const result = await client({ method: 'GET', url: 'https://example.com' })
    expect(result).toEqual({ status: 200, body: 'ok' })
  })

  it('throws IntakeError with host-only message when fetch rejects', async () => {
    const mockFetch = vi.mocked(globalThis.fetch)
    mockFetch.mockRejectedValue(new Error('network error'))

    const client = createFetchHttpClient()
    let error: unknown
    try {
      await client({
        method: 'GET',
        url: 'https://example.com/api/v1/projects',
      })
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(IntakeError)
    expect((error as IntakeError).statusCode).toBe(502)
    expect((error as IntakeError).message).toBe(
      'Request to example.com failed: network error',
    )
  })
})