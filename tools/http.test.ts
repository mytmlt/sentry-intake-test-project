import { describe, expect, it, vi } from 'vitest'
import { IntakeError } from './errors.ts'
import { createFetchHttpClient, parseJson, parseJsonSafe } from './http.ts'

describe('parseJson', () => {
  it('parses valid JSON', () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 })
    expect(parseJson('[1,2]')).toEqual([1, 2])
    expect(parseJson('"str"')).toBe('str')
    expect(parseJson('42')).toBe(42)
  })

  it('returns null for empty input', () => {
    expect(parseJson('')).toBe(null)
    expect(parseJson('  ')).toBe(null)
  })

  it('throws IntakeError for invalid JSON', () => {
    expect(() => parseJson('not json')).toThrow(IntakeError)
    expect(() => parseJson('{broken}')).toThrow('Upstream returned invalid JSON.')
  })
})

describe('parseJsonSafe', () => {
  it('returns parsed value for valid JSON', () => {
    expect(parseJsonSafe('{"ok":true}')).toEqual({ ok: true })
  })

  it('returns null for invalid JSON', () => {
    expect(parseJsonSafe('corrupted')).toBeNull()
  })
})

describe('createFetchHttpClient', () => {
  it('performs a fetch request and returns status and body', async () => {
    const mockResponse = {
      status: 200,
      text: () => Promise.resolve('{"ok":true}'),
    }
    const fetchSpy = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>()
    fetchSpy.mockResolvedValue(mockResponse as unknown as Response)
    vi.stubGlobal('fetch', fetchSpy)

    const client = createFetchHttpClient()
    const result = await client({ method: 'GET', url: 'https://example.com/api' })

    expect(result.status).toBe(200)
    expect(result.body).toBe('{"ok":true}')
    expect(fetchSpy).toHaveBeenCalledWith('https://example.com/api', {
      method: 'GET',
      headers: undefined,
      body: undefined,
    })
  })

  it('throws IntakeError with 502 when the network fails', async () => {
    const fetchSpy = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>()
    fetchSpy.mockRejectedValue(new Error('connection refused'))
    vi.stubGlobal('fetch', fetchSpy)

    const client = createFetchHttpClient()
    const error = await client({ method: 'GET', url: 'https://down.net/api' }).catch(
      (e) => e,
    )
    expect(error).toBeInstanceOf(IntakeError)
    expect(error.statusCode).toBe(502)
    expect(error.message).toContain('connection refused')
  })

  it('includes the hostname in network error messages', async () => {
    const fetchSpy = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>()
    fetchSpy.mockRejectedValue(new Error('timeout'))
    vi.stubGlobal('fetch', fetchSpy)

    const client = createFetchHttpClient()
    const error = await client({
      method: 'POST',
      url: 'https://myhost.example.com/path',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    }).catch((e) => e)
    expect(error.message).toContain('myhost.example.com')
  })
})