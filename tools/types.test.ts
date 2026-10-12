import { describe, expect, it } from 'vitest'
import {
  DEFAULT_JIRA_LABELS,
  isSentryLevel,
  JIRA_ACTIONS,
  JIRA_ASSIGNMENTS,
  SENTRY_ACTIONS,
  SENTRY_LEVELS,
} from './types.ts'

describe('SENTRY_LEVELS', () => {
  it('contains the standard Sentry severity levels', () => {
    expect(SENTRY_LEVELS).toEqual(['fatal', 'error', 'warning', 'info', 'debug'])
  })
})

describe('SENTRY_ACTIONS', () => {
  it('contains valid Sentry intake actions', () => {
    expect(SENTRY_ACTIONS).toEqual(['created', 'unresolved', 'assigned'])
  })
})

describe('JIRA_ACTIONS', () => {
  it('contains valid Jira intake actions', () => {
    expect(JIRA_ACTIONS).toEqual(['created', 'updated'])
  })
})

describe('JIRA_ASSIGNMENTS', () => {
  it('contains valid Jira assignment states', () => {
    expect(JIRA_ASSIGNMENTS).toEqual(['assigned', 'unassigned'])
  })
})

describe('DEFAULT_JIRA_LABELS', () => {
  it('contains the default intake test label', () => {
    expect(DEFAULT_JIRA_LABELS).toEqual(['intake-test'])
  })
})

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
    expect(isSentryLevel('warn')).toBe(false)
  })
})