import { describe, expect, it } from 'vitest'
import { hostOf, redactSecrets, uniqueSecrets } from './redact.ts'

describe('uniqueSecrets', () => {
  it('filters undefined and short values', () => {
    expect(uniqueSecrets(['long-secret', undefined, 'ab', '', 'another-secret'])).toEqual([
      'long-secret',
      'another-secret',
    ])
  })

  it('deduplicates secrets', () => {
    expect(uniqueSecrets(['secret', 'secret', 'other'])).toEqual(['secret', 'other'])
  })

  it('returns an empty array when given only short or empty values', () => {
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
    expect(hostOf('https://example.com/api')).toBe('example.com')
  })

  it('returns "upstream" for an invalid URL', () => {
    expect(hostOf('not-a-url')).toBe('upstream')
  })
})
