export type JiraAction = 'created' | 'updated'
export type JiraAssignment = 'assigned' | 'unassigned'
export type SentryAction = 'created' | 'unresolved' | 'assigned'
export type SentryLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug'
export type MatrixSource = 'all' | 'jira' | 'sentry'

export type JiraCreateInput = {
  labels: string[]
  assignment: JiraAssignment
  issueType?: string
  summary?: string
}

export type JiraUpdateInput = {
  issueKey?: string
  labels?: string[]
  assignment?: JiraAssignment
  summary?: string
}

export type SentryEventInput = {
  level: SentryLevel
  fingerprintId?: string
  message?: string
}

export type JiraEventResult = {
  source: 'jira'
  action: JiraAction
  issueKey: string
  labels: string[]
  assignment: JiraAssignment
  seeded: boolean
  summary: string
}

export type SentryEventResult = {
  source: 'sentry'
  action: SentryAction
  level: SentryLevel
  fingerprintId: string
  eventIds: string[]
  issueId?: string
  shortId?: string
  assignedTo?: string
}

export type SkippedMatrixCell = {
  source: 'jira' | 'sentry'
  reason: string
  detail: string
}

export type MatrixResult = {
  source: MatrixSource
  results: Array<JiraEventResult | SentryEventResult>
  skipped: SkippedMatrixCell[]
}

export type IntakeReadiness = {
  jira: boolean
  jiraAssign: boolean
  sentryCapture: boolean
  sentryManage: boolean
  sentryAssign: boolean
}

export type StatusResult = {
  readiness: IntakeReadiness
  missing: string[]
}

export type IntakeRequest =
  | { kind: 'status' }
  | {
      kind: 'jira.create'
      labels: string[]
      assignment: JiraAssignment
      issueType?: string
      summary?: string
    }
  | {
      kind: 'jira.update'
      issueKey?: string
      labels?: string[]
      assignment?: JiraAssignment
      summary?: string
    }
  | { kind: 'sentry.create'; level: SentryLevel }
  | { kind: 'sentry.unresolved'; level: SentryLevel }
  | { kind: 'sentry.assigned'; level: SentryLevel }
  | { kind: 'matrix'; source: MatrixSource }

export type IntakeResult =
  | StatusResult
  | JiraEventResult
  | SentryEventResult
  | MatrixResult

export const SENTRY_LEVELS: SentryLevel[] = [
  'fatal',
  'error',
  'warning',
  'info',
  'debug',
]

export const SENTRY_ACTIONS: SentryAction[] = [
  'created',
  'unresolved',
  'assigned',
]

export const JIRA_ACTIONS: JiraAction[] = ['created', 'updated']
export const JIRA_ASSIGNMENTS: JiraAssignment[] = ['assigned', 'unassigned']
export const DEFAULT_JIRA_LABELS = ['intake-test']

export function isSentryLevel(value: string): value is SentryLevel {
  return (SENTRY_LEVELS as string[]).includes(value)
}
