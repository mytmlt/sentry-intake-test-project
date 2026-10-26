import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFetchHttpClient, parseJson, parseJsonSafe } from './http.ts'
import { IntakeError } from './errors.ts'

afterEach(() => {
  vi.unstubAllGlobals()
})

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
    const error = new IntakeError('Upstream returned invalid JSON.', 502)
    expect(() => parseJson('nope')).toThrow(error)
  })
})

describe('parseJsonSafe', () => {
  it('returns null on invalid JSON', () => {
    expect(parseJsonSafe('nope')).toBeNull()
  })
})

describe('createFetchHttpClient', () => {
  it('returns status and body from a successful fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        status: 200,
        text: () => Promise.resolve('ok'),
      }),
    )

    const client = createFetchHttpClient()
    const result = await client({ method: 'GET', url: 'https://example.com' })

    expect(result).toEqual({ status: 200, body: 'ok' })
  })

  it('throws IntakeError on network error with host-only message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED')),
    )

    const client = createFetchHttpClient()
    const promise = client({ method: 'GET', url: 'https://example.com/data' })

    await expect(promise).rejects.toThrow(IntakeError)
    await expect(promise).rejects.toMatchObject({ statusCode: 502 })
    await expect(promise).rejects.toThrow(
      /Request to example\.com failed: connect ECONNREFUSED/,
    )
  })
})