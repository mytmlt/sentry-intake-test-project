import { IntakeError } from './errors.ts'
import type {
  IntakeRequest,
  JiraAssignment,
  MatrixSource,
  SentryLevel,
} from './types.ts'
import { DEFAULT_JIRA_LABELS, isSentryLevel } from './types.ts'

export const CLI_HELP = `Create Jira and Sentry events for SuperPlane factory intake filters.

Usage:
  npm run intake -- status
  npm run intake -- jira create [--summary <text>] [--labels a,b] [--no-labels] [--assignment assigned|unassigned] [--issue-type Task]
  npm run intake -- jira update [--issue KEY|--issue-key KEY] [--summary <text>] [--labels a,b] [--no-labels] [--assignment assigned|unassigned]
  npm run intake -- sentry create --level error
  npm run intake -- sentry regress|unresolved --level fatal
  npm run intake -- sentry assign|assigned --level warning
  npm run intake -- matrix [all|jira|sentry]

Flags:
  --summary <text>          Replace the generated summary when the text is non-empty after trim
  --no-labels               Set labels to an empty list and override the default
  --issue-key KEY           Alias of --issue for jira update
  --labels <a,b>            Comma-separated labels (default: intake-test)
  --assignment <mode>       Jira assignment: assigned|unassigned (default: unassigned)
  --level <level>           Sentry level: fatal|error|warning|info|debug (default: error)

Aliases:
  unresolved                Alias of sentry regress
  assigned                  Alias of sentry assign
`

type FlagMap = Record<string, string | boolean>

function parseFlags(args: string[]): FlagMap {
  const flags: FlagMap = {}
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index]
    if (!token.startsWith('--')) {
      throw new IntakeError(`Unexpected argument: ${token}`)
    }
    const trimmed = token.slice(2)
    const eq = trimmed.indexOf('=')
    if (eq >= 0) {
      flags[trimmed.slice(0, eq)] = trimmed.slice(eq + 1)
      continue
    }
    const next = args[index + 1]
    if (!next || next.startsWith('--')) {
      flags[trimmed] = true
      continue
    }
    flags[trimmed] = next
    index += 1
  }
  return flags
}

function flagString(flags: FlagMap, name: string): string | undefined {
  const value = flags[name]
  if (typeof value !== 'string') {
    return undefined
  }
  return value
}

function parseLabels(flags: FlagMap): string[] | undefined {
  if (flags['no-labels'] === true) {
    return []
  }
  const raw = flagString(flags, 'labels')
  if (raw === undefined) {
    return undefined
  }
  if (raw.trim() === '') {
    return []
  }
  return raw
    .split(',')
    .map((label) => label.trim())
    .filter(Boolean)
}

function parseAssignment(flags: FlagMap): JiraAssignment | undefined {
  const raw = flagString(flags, 'assignment')
  if (raw === undefined) {
    return undefined
  }
  if (raw !== 'assigned' && raw !== 'unassigned') {
    throw new IntakeError('Assignment must be assigned or unassigned.')
  }
  return raw
}

function parseLevel(flags: FlagMap): SentryLevel {
  const raw = flagString(flags, 'level') ?? 'error'
  if (!isSentryLevel(raw)) {
    throw new IntakeError(
      'Level must be fatal, error, warning, info, or debug.',
    )
  }
  return raw
}

export function parseArgv(argv: string[]): IntakeRequest | { kind: 'help' } {
  if (argv.length === 0 || argv[0] === '-h' || argv[0] === '--help') {
    return { kind: 'help' }
  }

  const [command, subcommand, ...rest] = argv
  const flags = parseFlags(rest)

  if (command === 'status') {
    if (subcommand) {
      throw new IntakeError(`Unexpected argument: ${subcommand}`)
    }
    return { kind: 'status' }
  }

  if (command === 'matrix') {
    const source = (subcommand ?? 'all') as string
    if (source !== 'all' && source !== 'jira' && source !== 'sentry') {
      throw new IntakeError('Matrix source must be all, jira, or sentry.')
    }
    if (rest.length > 0) {
      throw new IntakeError(`Unexpected argument: ${rest[0]}`)
    }
    return { kind: 'matrix', source: source as MatrixSource }
  }

  if (command === 'jira') {
    if (subcommand === 'create') {
      return {
        kind: 'jira.create',
        labels: parseLabels(flags) ?? DEFAULT_JIRA_LABELS,
        assignment: parseAssignment(flags) ?? 'unassigned',
        issueType: flagString(flags, 'issue-type'),
        summary: flagString(flags, 'summary'),
      }
    }
    if (subcommand === 'update') {
      return {
        kind: 'jira.update',
        issueKey: flagString(flags, 'issue') ?? flagString(flags, 'issue-key'),
        labels: parseLabels(flags) ?? DEFAULT_JIRA_LABELS,
        assignment: parseAssignment(flags) ?? 'unassigned',
        summary: flagString(flags, 'summary'),
      }
    }
    throw new IntakeError('Jira command must be create or update.')
  }

  if (command === 'sentry') {
    const level = parseLevel(flags)
    if (subcommand === 'create') {
      return { kind: 'sentry.create', level }
    }
    if (subcommand === 'regress' || subcommand === 'unresolved') {
      return { kind: 'sentry.unresolved', level }
    }
    if (subcommand === 'assign' || subcommand === 'assigned') {
      return { kind: 'sentry.assigned', level }
    }
    throw new IntakeError(
      'Sentry command must be create, regress, or assign.',
    )
  }

  throw new IntakeError(`Unknown command: ${command}`)
}
