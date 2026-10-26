import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { parseJson, parseJsonSafe, createFetchHttpClient } from './http.ts'
import { IntakeError } from './errors.ts'
import { hostOf } from './redact.ts'

describe('parseJson', () => {
  it('returns null for an empty string', () => {
    expect(parseJson('')).toBeNull()
  })

  it('returns null for whitespace-only string', () => {
    expect(parseJson('   ')).toBeNull()
  })

  it('parses a valid JSON object', () => {
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
    expect((error as IntakeError).message).toBe('Upstream returned invalid JSON.')
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

  it('returns status and body from a successful fetch', async () => {
    const mockResponse = { status: 200, text: () => Promise.resolve('{"ok":true}') }
    vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response)

    const client = createFetchHttpClient()
    const result = await client({ method: 'GET', url: 'https://example.com/api' })

    expect(result).toEqual({ status: 200, body: '{"ok":true}' })
  })

  it('throws IntakeError with host-only message when fetch rejects', async () => {
    const url = 'https://example.com/api/data'
    vi.mocked(fetch).mockRejectedValue(new Error('connection refused'))

    const client = createFetchHttpClient()

    let error: unknown
    try {
      await client({ method: 'GET', url })
    } catch (e) {
      error = e
    }

    expect(error).toBeInstanceOf(IntakeError)
    expect((error as IntakeError).statusCode).toBe(502)
    expect((error as IntakeError).message).toBe(
      `Request to ${hostOf(url)} failed: connection refused`,
    )
  })
})