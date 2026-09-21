import { missingEnvNames, readiness, type IntakeConfig } from './config.ts'
import { IntakeError } from './errors.ts'
import type { JiraGenerator } from './jira.ts'
import { jiraMatrix, sentryMatrix } from './matrix.ts'
import type { SentryGenerator } from './sentry.ts'
import type {
  IntakeReadiness,
  IntakeRequest,
  IntakeResult,
  JiraEventResult,
  MatrixResult,
  SentryEventResult,
  SkippedMatrixCell,
} from './types.ts'

export type IntakeDeps = {
  config: IntakeConfig
  jira: JiraGenerator
  sentry: SentryGenerator
}

function requireReady(
  ready: boolean,
  message: string,
): void {
  if (!ready) {
    throw new IntakeError(message)
  }
}

function currentReadiness(config: IntakeConfig): IntakeReadiness {
  return readiness(config)
}

export async function executeIntake(
  request: IntakeRequest,
  deps: IntakeDeps,
): Promise<IntakeResult> {
  const ready = currentReadiness(deps.config)

  switch (request.kind) {
    case 'status':
      return {
        readiness: ready,
        missing: missingEnvNames(deps.config),
      }
    case 'jira.create':
      requireReady(
        ready.jira,
        'Set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, and JIRA_PROJECT_KEY.',
      )
      if (request.assignment === 'assigned') {
        requireReady(
          ready.jiraAssign,
          'Set JIRA_ASSIGNEE_ACCOUNT_ID to create an assigned Jira issue.',
        )
      }
      return deps.jira.create(request)
    case 'jira.update':
      requireReady(
        ready.jira,
        'Set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, and JIRA_PROJECT_KEY.',
      )
      if (request.assignment === 'assigned') {
        requireReady(
          ready.jiraAssign,
          'Set JIRA_ASSIGNEE_ACCOUNT_ID to update a Jira issue as assigned.',
        )
      }
      return deps.jira.update(request)
    case 'sentry.create':
      requireReady(
        ready.sentryCapture,
        'Set SENTRY_DSN or VITE_SENTRY_DSN to capture a Sentry event.',
      )
      return deps.sentry.create({ level: request.level })
    case 'sentry.unresolved':
      requireReady(
        ready.sentryManage,
        'Set SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT to regress a Sentry issue.',
      )
      return deps.sentry.regress({ level: request.level })
    case 'sentry.assigned':
      requireReady(
        ready.sentryAssign,
        'Set SENTRY_ASSIGNEE and SENTRY_AUTH_TOKEN to assign a Sentry issue.',
      )
      return deps.sentry.assign({ level: request.level })
    case 'matrix':
      return runMatrix(request.source, deps, ready)
  }
}

async function runMatrix(
  source: 'all' | 'jira' | 'sentry',
  deps: IntakeDeps,
  ready: IntakeReadiness,
): Promise<MatrixResult> {
  const results: Array<JiraEventResult | SentryEventResult> = []
  const skipped: SkippedMatrixCell[] = []

  if (source === 'all' || source === 'jira') {
    if (!ready.jira) {
      skipped.push({
        source: 'jira',
        reason: 'Jira is not configured.',
        detail:
          'Set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, and JIRA_PROJECT_KEY.',
      })
    } else {
      for (const cell of jiraMatrix()) {
        if (cell.assignment === 'assigned' && !ready.jiraAssign) {
          skipped.push({
            source: 'jira',
            reason: 'Jira assignee is not configured.',
            detail: `${cell.action} ${cell.assignment}`,
          })
          continue
        }
        if (cell.action === 'created') {
          results.push(
            await deps.jira.create({
              labels: cell.labels,
              assignment: cell.assignment,
            }),
          )
          continue
        }
        results.push(
          await deps.jira.update({
            labels: cell.labels,
            assignment: cell.assignment,
          }),
        )
      }
    }
  }

  if (source === 'all' || source === 'sentry') {
    if (!ready.sentryCapture) {
      skipped.push({
        source: 'sentry',
        reason: 'Sentry DSN is not configured.',
        detail: 'Set SENTRY_DSN or VITE_SENTRY_DSN.',
      })
    } else {
      for (const cell of sentryMatrix()) {
        if (cell.action === 'created') {
          results.push(await deps.sentry.create({ level: cell.level }))
          continue
        }
        if (cell.action === 'unresolved') {
          if (!ready.sentryManage) {
            skipped.push({
              source: 'sentry',
              reason: 'Sentry issue API is not configured.',
              detail: `${cell.action} ${cell.level}`,
            })
            continue
          }
          results.push(await deps.sentry.regress({ level: cell.level }))
          continue
        }
        if (!ready.sentryAssign) {
          skipped.push({
            source: 'sentry',
            reason: 'Sentry assignee is not configured.',
            detail: `${cell.action} ${cell.level}`,
          })
          continue
        }
        results.push(await deps.sentry.assign({ level: cell.level }))
      }
    }
  }

  return { source, results, skipped }
}
