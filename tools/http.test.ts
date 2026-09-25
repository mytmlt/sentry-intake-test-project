import { afterEach, describe, expect, it, vi } from 'vitest'
import { IntakeError } from './errors.ts'
import { createFetchHttpClient, parseJson, parseJsonSafe } from './http.ts'

describe('parseJson', () => {
  it('parses valid JSON bodies', () => {
    expect(parseJson('{"id":"10001","key":"SHOP-1"}')).toEqual({
      id: '10001',
      key: 'SHOP-1',
    })
  })

  it('returns null for empty or whitespace-only bodies', () => {
    expect(parseJson('')).toBeNull()
    expect(parseJson('  \n')).toBeNull()
  })

  it('throws a 502 IntakeError for invalid JSON', () => {
    let caught: unknown
    try {
      parseJson('<html>Bad gateway</html>')
    } catch (error) {
      caught = error
    }
    expect(caught).toBeInstanceOf(IntakeError)
    expect((caught as IntakeError).statusCode).toBe(502)
    expect((caught as IntakeError).message).toBe('Upstream returned invalid JSON.')
  })
})

describe('parseJsonSafe', () => {
  it('returns parsed JSON when valid', () => {
    expect(parseJsonSafe('[1,2]')).toEqual([1, 2])
  })

  it('returns null instead of throwing on invalid JSON', () => {
    expect(parseJsonSafe('not json')).toBeNull()
  })
})

describe('createFetchHttpClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('forwards the request and returns status and text body', async () => {
    const fetchMock = vi.fn(async () => new Response('{"ok":true}', { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)

    const client = createFetchHttpClient()
    const response = await client({
      method: 'POST',
      url: 'https://example.atlassian.net/rest/api/3/issue',
      headers: { 'Content-Type': 'application/json' },
      body: '{"fields":{}}',
    })

    expect(response).toEqual({ status: 201, body: '{"ok":true}' })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.atlassian.net/rest/api/3/issue',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"fields":{}}',
      },
    )
  })

  it('returns non-2xx responses without throwing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 404 })))

    const response = await createFetchHttpClient()({
      method: 'GET',
      url: 'https://sentry.io/api/0/issues/1/',
    })

    expect(response).toEqual({ status: 404, body: 'nope' })
  })

  it('wraps network failures in a 502 IntakeError naming only the host', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('fetch failed')
      }),
    )

    const request = createFetchHttpClient()({
      method: 'GET',
      url: 'https://sentry.io/api/0/projects/org/proj/issues/?query=secret',
    })

    await expect(request).rejects.toBeInstanceOf(IntakeError)
    await expect(request).rejects.toMatchObject({
      statusCode: 502,
      message: 'Request to sentry.io failed: fetch failed',
    })
  })

  it('falls back to a generic host label for unparsable URLs', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw 'offline'
      }),
    )

    await expect(
      createFetchHttpClient()({ method: 'GET', url: 'not a url' }),
    ).rejects.toMatchObject({
      statusCode: 502,
      message: 'Request to upstream failed: offline',
    })
  })
})
