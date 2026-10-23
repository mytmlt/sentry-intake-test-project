import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { createFetchHttpClient, parseJson, parseJsonSafe } from './http.ts'
import { IntakeError } from './errors.ts'

describe('parseJson', () => {
  it('returns null for empty string', () => {
    expect(parseJson('')).toBeNull()
  })

  it('returns null for whitespace-only string', () => {
    expect(parseJson('   ')).toBeNull()
  })

  it('parses valid JSON', () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 })
  })

  it('throws IntakeError for invalid JSON', () => {
    expect(() => parseJson('nope')).toThrow(IntakeError)
    expect(() => parseJson('nope')).toThrow('Upstream returned invalid JSON.')
    try {
      parseJson('nope')
    } catch (error) {
      expect(error).toBeInstanceOf(IntakeError)
      expect((error as IntakeError).statusCode).toBe(502)
    }
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

  it('returns status and body on success', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      text: () => Promise.resolve('ok'),
    })
    vi.stubGlobal('fetch', mockFetch)

    const client = createFetchHttpClient()
    const result = await client({ method: 'GET', url: 'http://example.com/api' })
    expect(result).toEqual({ status: 200, body: 'ok' })
  })

  it('throws IntakeError with host-only URL on fetch rejection', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('connection refused'))
    vi.stubGlobal('fetch', mockFetch)

    const client = createFetchHttpClient()
    try {
      await client({ method: 'GET', url: 'http://example.com/api' })
      expect.unreachable()
    } catch (error) {
      expect(error).toBeInstanceOf(IntakeError)
      expect((error as IntakeError).statusCode).toBe(502)
      expect((error as Error).message).toMatch(
        /Request to example\.com failed: connection refused/,
      )
    }
  })
})