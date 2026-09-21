import { describe, expect, it } from 'vitest'
import { redactSecrets } from './redact.ts'

describe('redactSecrets', () => {
  it('replaces configured secrets and ignores short values', () => {
    const text = redactSecrets(
      'token=super-secret-token dsn=https://abc.ingest.sentry.io/1 ok=ab',
      ['super-secret-token', 'https://abc.ingest.sentry.io/1', 'ab', ''],
    )
    expect(text).toBe('token=*** dsn=*** ok=ab')
  })
})
