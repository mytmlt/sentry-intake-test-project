import { describe, expect, it } from 'vitest'
import { isSentryLevel, SENTRY_LEVELS } from './types.ts'

describe('isSentryLevel', () => {
  it('returns true for valid Sentry level strings', () => {
    for (const level of SENTRY_LEVELS) {
      expect(isSentryLevel(level)).toBe(true)
    }
  })

  it('returns false for invalid level strings', () => {
    expect(isSentryLevel('log')).toBe(false)
    expect(isSentryLevel('critical')).toBe(false)
    expect(isSentryLevel('')).toBe(false)
    expect(isSentryLevel('ERROR')).toBe(false)
  })
})