import { describe, expect, it } from 'vitest'
import { isSentryLevel, SENTRY_LEVELS, JIRA_ACTIONS } from './types.ts'

describe('isSentryLevel', () => {
  it('returns true for valid Sentry levels', () => {
    for (const level of SENTRY_LEVELS) {
      expect(isSentryLevel(level)).toBe(true)
    }
  })

  it('returns false for invalid levels', () => {
    expect(isSentryLevel('critical')).toBe(false)
    expect(isSentryLevel('log')).toBe(false)
    expect(isSentryLevel('')).toBe(false)
  })
})

describe('constants', () => {
  it('defines the correct Sentry levels', () => {
    expect(SENTRY_LEVELS).toEqual(['fatal', 'error', 'warning', 'info', 'debug'])
  })

  it('defines the correct Jira actions', () => {
    expect(JIRA_ACTIONS).toEqual(['created', 'updated'])
  })
})