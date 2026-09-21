import * as Sentry from '@sentry/react'

export const sentryDsn = import.meta.env.VITE_SENTRY_DSN?.trim() ?? ''

export function isSentryConfigured(): boolean {
  return sentryDsn.length > 0
}

Sentry.init({
  dsn: sentryDsn || undefined,
  enabled: isSentryConfigured(),
  environment: 'local',
  tracesSampleRate: 0,
})
