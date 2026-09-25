import { afterEach, describe, expect, it, vi } from 'vitest'
import { isIntakeError } from './errors.ts'
import { createFetchHttpClient, parseJson, parseJsonSafe } from './http.ts'

describe('parseJson', () => {
  it('returns null for an empty body', () => {
    expect(parseJson('')).toBeNull()
    expect(parseJson('   ')).toBeNull()
  })

  it('parses valid JSON', () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 })
  })

  it('throws an IntakeError with status 502 for invalid JSON', () => {
    try {
      parseJson('{not json')
      expect.unreachable('parseJson should have thrown')
    } catch (error) {
      expect(isIntakeError(error)).toBe(true)
      if (isIntakeError(error)) {
        expect(error.statusCode).toBe(502)
        expect(error.message).toBe('Upstream returned invalid JSON.')
      }
    }
  })
})

describe('parseJsonSafe', () => {
  it('returns the parsed value for valid JSON', () => {
    expect(parseJsonSafe('{"a":1}')).toEqual({ a: 1 })
  })

  it('returns null instead of throwing for invalid JSON', () => {
    expect(parseJsonSafe('{not json')).toBeNull()
  })

  it('returns null for an empty body', () => {
    expect(parseJsonSafe('')).toBeNull()
  })
})

describe('createFetchHttpClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('forwards the request and returns the response status and body', async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      expect(url).toBe('https://example.test/resource')
      expect(init?.method).toBe('POST')
      expect(init?.headers).toEqual({ 'Content-Type': 'application/json' })
      expect(init?.body).toBe('{"ok":true}')
      return new Response('{"result":"done"}', { status: 201 })
    })
    vi.stubGlobal('fetch', fetchMock)

    const client = createFetchHttpClient()
    const response = await client({
      method: 'POST',
      url: 'https://example.test/resource',
      headers: { 'Content-Type': 'application/json' },
      body: '{"ok":true}',
    })

    expect(response.status).toBe(201)
    expect(response.body).toBe('{"result":"done"}')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('wraps network failures in an IntakeError with a redacted host', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down')
      }),
    )

    const client = createFetchHttpClient()

    try {
      await client({ method: 'GET', url: 'https://upstream.example/api' })
      expect.unreachable('client should have thrown')
    } catch (error) {
      expect(isIntakeError(error)).toBe(true)
      if (isIntakeError(error)) {
        expect(error.statusCode).toBe(502)
        expect(error.message).toBe(
          'Request to upstream.example failed: network down',
        )
      }
    }
  })
})
