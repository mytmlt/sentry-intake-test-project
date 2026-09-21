import {
  DEFAULT_JIRA_LABELS,
  JIRA_ACTIONS,
  JIRA_ASSIGNMENTS,
  SENTRY_ACTIONS,
  SENTRY_LEVELS,
  type JiraAction,
  type JiraAssignment,
  type SentryAction,
  type SentryLevel,
} from './types.ts'

export type JiraMatrixCell = {
  action: JiraAction
  assignment: JiraAssignment
  labels: string[]
}

export type SentryMatrixCell = {
  action: SentryAction
  level: SentryLevel
}

const JIRA_LABEL_VARIANTS: string[][] = [DEFAULT_JIRA_LABELS, []]

export function jiraMatrix(): JiraMatrixCell[] {
  const cells: JiraMatrixCell[] = []
  for (const action of JIRA_ACTIONS) {
    for (const assignment of JIRA_ASSIGNMENTS) {
      for (const labels of JIRA_LABEL_VARIANTS) {
        cells.push({ action, assignment, labels })
      }
    }
  }
  return cells
}

export function sentryMatrix(): SentryMatrixCell[] {
  const cells: SentryMatrixCell[] = []
  for (const action of SENTRY_ACTIONS) {
    for (const level of SENTRY_LEVELS) {
      cells.push({ action, level })
    }
  }
  return cells
}
