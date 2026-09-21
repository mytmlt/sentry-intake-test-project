import { describe, expect, it } from 'vitest'
import { missingEnvNames, parseConfig, readiness } from './config.ts'

describe('parseConfig', () => {
  it('uses VITE_SENTRY_DSN when SENTRY_DSN is empty', () => {
    const config = parseConfig({
      VITE_SENTRY_DSN: 'https://abc@o0.ingest.sentry.io/1',
    })
    expect(config.sentry.dsn).toBe('https://abc@o0.ingest.sentry.io/1')
  })

  it('prefers SENTRY_DSN over the browser DSN', () => {
    const config = parseConfig({
      SENTRY_DSN: 'https://server@o0.ingest.sentry.io/2',
      VITE_SENTRY_DSN: 'https://browser@o0.ingest.sentry.io/1',
    })
    expect(config.sentry.dsn).toBe('https://server@o0.ingest.sentry.io/2')
  })

  it('defaults the Sentry API host and Jira issue type', () => {
    const config = parseConfig({})
    expect(config.sentry.apiBaseUrl).toBe('https://sentry.io')
    expect(config.jira.issueType).toBe('Task')
  })

  it('strips trailing slashes from base URLs', () => {
    const config = parseConfig({
      JIRA_BASE_URL: 'https://example.atlassian.net/',
      SENTRY_URL: 'https://sentry.example.com/',
    })
    expect(config.jira.baseUrl).toBe('https://example.atlassian.net')
    expect(config.sentry.apiBaseUrl).toBe('https://sentry.example.com')
  })
})

describe('readiness', () => {
  it('reports missing Jira and Sentry capabilities', () => {
    const config = parseConfig({})
    expect(readiness(config)).toEqual({
      jira: false,
      jiraAssign: false,
      sentryCapture: false,
      sentryManage: false,
      sentryAssign: false,
    })
    expect(missingEnvNames(config)).toContain('JIRA_API_TOKEN')
    expect(missingEnvNames(config)).toContain('SENTRY_DSN or VITE_SENTRY_DSN')
  })

  it('marks capture ready from DSN alone', () => {
    const config = parseConfig({
      SENTRY_DSN: 'https://abc@o0.ingest.sentry.io/1',
    })
    expect(readiness(config).sentryCapture).toBe(true)
    expect(readiness(config).sentryManage).toBe(false)
  })
})
