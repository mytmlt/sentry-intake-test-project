import type { IntakeReadiness } from './types.ts'

export type JiraConfig = {
  baseUrl: string
  email: string
  apiToken: string
  projectKey: string
  issueType: string
  assigneeAccountId: string
}

export type SentryConfig = {
  dsn: string
  authToken: string
  org: string
  project: string
  assignee: string
  apiBaseUrl: string
}

export type IntakeConfig = {
  jira: JiraConfig
  sentry: SentryConfig
}

function read(env: Record<string, string | undefined>, key: string): string {
  return env[key]?.trim() ?? ''
}

function trimSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export function parseConfig(
  env: Record<string, string | undefined>,
): IntakeConfig {
  return {
    jira: {
      baseUrl: trimSlash(read(env, 'JIRA_BASE_URL')),
      email: read(env, 'JIRA_EMAIL'),
      apiToken: read(env, 'JIRA_API_TOKEN'),
      projectKey: read(env, 'JIRA_PROJECT_KEY'),
      issueType: read(env, 'JIRA_ISSUE_TYPE') || 'Task',
      assigneeAccountId: read(env, 'JIRA_ASSIGNEE_ACCOUNT_ID'),
    },
    sentry: {
      dsn: read(env, 'SENTRY_DSN') || read(env, 'VITE_SENTRY_DSN'),
      authToken: read(env, 'SENTRY_AUTH_TOKEN'),
      org: read(env, 'SENTRY_ORG'),
      project: read(env, 'SENTRY_PROJECT'),
      assignee: read(env, 'SENTRY_ASSIGNEE'),
      apiBaseUrl: trimSlash(read(env, 'SENTRY_URL')) || 'https://sentry.io',
    },
  }
}

export function readiness(config: IntakeConfig): IntakeReadiness {
  const jira =
    Boolean(config.jira.baseUrl) &&
    Boolean(config.jira.email) &&
    Boolean(config.jira.apiToken) &&
    Boolean(config.jira.projectKey)
  const sentryCapture = Boolean(config.sentry.dsn)
  const sentryManage =
    sentryCapture &&
    Boolean(config.sentry.authToken) &&
    Boolean(config.sentry.org) &&
    Boolean(config.sentry.project)

  return {
    jira,
    jiraAssign: jira && Boolean(config.jira.assigneeAccountId),
    sentryCapture,
    sentryManage,
    sentryAssign: sentryManage && Boolean(config.sentry.assignee),
  }
}

export function missingEnvNames(config: IntakeConfig): string[] {
  const missing: string[] = []
  if (!config.jira.baseUrl) missing.push('JIRA_BASE_URL')
  if (!config.jira.email) missing.push('JIRA_EMAIL')
  if (!config.jira.apiToken) missing.push('JIRA_API_TOKEN')
  if (!config.jira.projectKey) missing.push('JIRA_PROJECT_KEY')
  if (!config.jira.assigneeAccountId) missing.push('JIRA_ASSIGNEE_ACCOUNT_ID')
  if (!config.sentry.dsn) missing.push('SENTRY_DSN or VITE_SENTRY_DSN')
  if (!config.sentry.authToken) missing.push('SENTRY_AUTH_TOKEN')
  if (!config.sentry.org) missing.push('SENTRY_ORG')
  if (!config.sentry.project) missing.push('SENTRY_PROJECT')
  if (!config.sentry.assignee) missing.push('SENTRY_ASSIGNEE')
  return missing
}

export function configSecrets(config: IntakeConfig): string[] {
  return [
    config.jira.apiToken,
    config.sentry.authToken,
    config.sentry.dsn,
  ]
}
