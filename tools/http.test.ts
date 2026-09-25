import { describe, expect, it, vi } from 'vitest'
import {
  createFetchHttpClient,
  parseJson,
  parseJsonSafe,
  type HttpClient,
} from './http.ts'

describe('parseJson', () => {
  it('parses a valid JSON string', () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 })
  })

  it('returns null for empty body', () => {
    expect(parseJson('')).toBeNull()
  })

  it('returns null for whitespace-only body', () => {
    expect(parseJson('  ')).toBeNull()
  })

  it('throws an IntakeError for malformed JSON', () => {
    expect(() => parseJson('not json')).toThrow('Upstream returned invalid JSON')
  })
})

describe('parseJsonSafe', () => {
  it('parses valid JSON', () => {
    expect(parseJsonSafe('[1,2,3]')).toEqual([1, 2, 3])
  })

  it('returns null for malformed JSON instead of throwing', () => {
    expect(parseJsonSafe('broken')).toBeNull()
  })

  it('returns null for empty input', () => {
    expect(parseJsonSafe('')).toBeNull()
  })
})

describe('createFetchHttpClient', () => {
  it('makes a fetch request and returns status and body', async () => {
    const fakeResponse = { status: 200, text: async () => '{"ok":true}' }
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(fakeResponse as Response)

    const client: HttpClient = createFetchHttpClient()
    const result = await client({
      method: 'POST',
      url: 'https://example.com/api',
      headers: { Authorization: 'Bearer xyz' },
      body: '{"kind":"test"}',
    })

    expect(result).toEqual({ status: 200, body: '{"ok":true}' })
    expect(fetchSpy).toHaveBeenCalledWith('https://example.com/api', {
      method: 'POST',
      headers: { Authorization: 'Bearer xyz' },
      body: '{"kind":"test"}',
    })

    fetchSpy.mockRestore()
  })

  it('throws an IntakeError when the network request fails', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('connect ECONNREFUSED'))

    const client: HttpClient = createFetchHttpClient()
    await expect(() =>
      client({
        method: 'GET',
        url: 'https://example.atlassian.net/rest/api/3/issue',
      }),
    ).rejects.toThrow(
      'Request to example.atlassian.net failed: connect ECONNREFUSED',
    )

    fetchSpy.mockRestore()
  })

  it('includes the host when wrapping unknown errors', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue('string error')

    const client: HttpClient = createFetchHttpClient()
    await expect(() =>
      client({
        method: 'GET',
        url: 'https://sentry.io/api/0/projects/',
      }),
    ).rejects.toThrow('Request to sentry.io failed: string error')

    fetchSpy.mockRestore()
  })

  it('handles malformed URLs gracefully', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('bad url'))

    const client: HttpClient = createFetchHttpClient()
    await expect(() =>
      client({
        method: 'GET',
        url: 'not-a-url',
      }),
    ).rejects.toThrow('Request to upstream failed: bad url')

    fetchSpy.mockRestore()
  })
})