import { describe, expect, it } from 'vitest'
import { hostOf, redactSecrets, uniqueSecrets } from './redact.ts'

describe('uniqueSecrets', () => {
  it('deduplicates and filters short and empty secrets', () => {
    const result = uniqueSecrets([
      'token-123',
      'token-123',
      'ab',
      '',
      undefined,
      'dsn-456',
    ])
    expect(result).toEqual(['token-123', 'dsn-456'])
  })

  it('returns an empty array when there are no valid secrets', () => {
    expect(uniqueSecrets(['ab', '', undefined])).toEqual([])
  })
})

describe('redactSecrets', () => {
  it('replaces configured secrets and ignores short values', () => {
    const text = redactSecrets(
      'token=super-secret-token dsn=https://abc.ingest.sentry.io/1 ok=ab',
      ['super-secret-token', 'https://abc.ingest.sentry.io/1', 'ab', ''],
    )
    expect(text).toBe('token=*** dsn=*** ok=ab')
  })
})

describe('hostOf', () => {
  it('extracts the host from a valid URL', () => {
    expect(hostOf('https://example.atlassian.net/path')).toBe(
      'example.atlassian.net',
    )
  })

  it('returns "upstream" for invalid URLs', () => {
    expect(hostOf('not-a-url')).toBe('upstream')
  })
})
