import { parseConfig, type IntakeConfig } from './config.ts'
import { createFetchHttpClient } from './http.ts'
import { createJiraGenerator } from './jira.ts'
import { executeIntake, type IntakeDeps } from './operations.ts'
import { systemClock, type Clock } from './retry.ts'
import { createSdkCapture, createSentryGenerator } from './sentry.ts'
import type { IntakeRequest, IntakeResult } from './types.ts'

export function assembleDeps(
  env: Record<string, string | undefined>,
  options?: { clock?: Clock },
): { config: IntakeConfig; deps: IntakeDeps } {
  const config = parseConfig(env)
  const http = createFetchHttpClient()
  const clock = options?.clock ?? systemClock
  const deps: IntakeDeps = {
    config,
    jira: createJiraGenerator(config.jira, http),
    sentry: createSentryGenerator({
      config: config.sentry,
      http,
      capture: createSdkCapture(config.sentry.dsn),
      clock,
    }),
  }
  return { config, deps }
}

export async function runIntakeRequest(
  request: IntakeRequest,
  env: Record<string, string | undefined>,
  options?: { clock?: Clock },
): Promise<IntakeResult> {
  const { deps } = assembleDeps(env, options)
  return executeIntake(request, deps)
}
