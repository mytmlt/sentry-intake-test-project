import { afterEach, describe, expect, it, vi } from 'vitest'
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
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('performs a fetch request and returns status and body', async () => {
    const response = { status: 200, text: () => Promise.resolve('{"ok":true}') }
    const fetch = vi.fn().mockResolvedValue(response)
    vi.stubGlobal('fetch', fetch)

    const client = createFetchHttpClient()
    const result = await client({ method: 'GET', url: 'https://example.com/api' })

    expect(result.status).toBe(200)
    expect(result.body).toBe('{"ok":true}')
    expect(fetch).toHaveBeenCalledWith('https://example.com/api', {
      method: 'GET',
      headers: undefined,
      body: undefined,
    })
  })

  it('throws IntakeError with status 502 when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('connection refused')))

    const client = createFetchHttpClient()
    const error = await client({ method: 'GET', url: 'https://down.net/api' }).catch(
      (e) => e,
    )

    expect(error).toBeInstanceOf(IntakeError)
    expect(error.statusCode).toBe(502)
    expect(error.message).toContain('connection refused')
  })

  it('includes the target hostname in network error messages', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))

    const client = createFetchHttpClient()
    const error = await client({
      method: 'POST',
      url: 'https://myhost.example.com/path',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    }).catch((e) => e)

    expect(error.message).toContain('myhost.example.com')
  })

  it('handles non-Error rejection with upstream hostname', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('string error'))

    const client = createFetchHttpClient()
    const error = await client({ method: 'GET', url: 'https://api.test/route' }).catch(
      (e) => e,
    )

    expect(error).toBeInstanceOf(IntakeError)
    expect(error.statusCode).toBe(502)
    expect(error.message).toContain('api.test')
    expect(error.message).toContain('string error')
  })
})