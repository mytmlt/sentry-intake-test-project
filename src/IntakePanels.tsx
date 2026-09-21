import { useEffect, useState } from 'react'
import {
  fetchIntakeStatus,
  runIntake,
  type IntakeRequest,
  type IntakeResult,
  type StatusResult,
} from './intakeApi'
import {
  DEFAULT_JIRA_LABELS,
  SENTRY_LEVELS,
  type JiraAssignment,
  type SentryAction,
  type SentryLevel,
} from '../tools/types.ts'

type LogEntry = {
  id: number
  at: string
  ok: boolean
  text: string
}

function formatResult(result: IntakeResult): string {
  if ('readiness' in result) {
    return `Jira ${result.readiness.jira ? 'ready' : 'not ready'}; Sentry capture ${result.readiness.sentryCapture ? 'ready' : 'not ready'}.`
  }
  if ('skipped' in result) {
    return `Created ${result.results.length} events. Skipped ${result.skipped.length}.`
  }
  if (result.source === 'jira') {
    const seed = result.seeded ? ' Seeded a new issue first.' : ''
    return `Jira ${result.issueKey} (${result.action}, ${result.assignment}, labels: ${result.labels.join(', ') || 'none'}).${seed}`
  }
  const issue = result.shortId || result.issueId || result.eventIds[0]
  return `Sentry ${issue} (${result.action}, ${result.level}).`
}

function parseLabels(raw: string): string[] {
  return raw
    .split(',')
    .map((label) => label.trim())
    .filter(Boolean)
}

export function IntakePanels() {
  const [status, setStatus] = useState<StatusResult | null>(null)
  const [statusError, setStatusError] = useState('')
  const [statusLoaded, setStatusLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState<LogEntry[]>([])

  const [jiraAction, setJiraAction] = useState<'created' | 'updated'>('created')
  const [jiraLabels, setJiraLabels] = useState(DEFAULT_JIRA_LABELS.join(', '))
  const [jiraAssignment, setJiraAssignment] =
    useState<JiraAssignment>('unassigned')
  const [jiraIssueKey, setJiraIssueKey] = useState('')

  const [sentryAction, setSentryAction] = useState<SentryAction>('created')
  const [sentryLevel, setSentryLevel] = useState<SentryLevel>('error')

  useEffect(() => {
    fetchIntakeStatus()
      .then((loaded) => {
        setStatus(loaded)
        setStatusError('')
      })
      .catch((error: unknown) => {
        setStatusError(
          error instanceof Error ? error.message : 'Could not load intake status.',
        )
      })
      .finally(() => {
        setStatusLoaded(true)
      })
  }, [])

  async function run(request: IntakeRequest, confirmBulk = false) {
    if (confirmBulk) {
      const accepted = window.confirm(
        'Create every selected filter event? This creates multiple Jira or Sentry issues.',
      )
      if (!accepted) {
        return
      }
    }
    setBusy(true)
    try {
      const result = await runIntake(request)
      setLog((entries) => [
        {
          id: Date.now(),
          at: new Date().toLocaleTimeString(),
          ok: true,
          text: formatResult(result),
        },
        ...entries,
      ])
    } catch (error) {
      setLog((entries) => [
        {
          id: Date.now(),
          at: new Date().toLocaleTimeString(),
          ok: false,
          text: error instanceof Error ? error.message : String(error),
        },
        ...entries,
      ])
    } finally {
      setBusy(false)
    }
  }

  const ready = status?.readiness

  return (
    <section className="intake">
      <div className="section-head">
        <h2>Factory intake events</h2>
        <p>
          Create Jira and Sentry events for SuperPlane filter tests. Tokens stay
          on the local server.
        </p>
      </div>

      <ul className="readiness" aria-label="Intake configuration">
        {!statusLoaded ? (
          <li className="warn">Loading configuration</li>
        ) : (
          <>
            <li className={ready?.jira ? 'ok' : 'warn'}>
              Jira {ready?.jira ? 'ready' : 'not configured'}
            </li>
            <li className={ready?.jiraAssign ? 'ok' : 'warn'}>
              Jira assignee {ready?.jiraAssign ? 'ready' : 'not configured'}
            </li>
            <li className={ready?.sentryCapture ? 'ok' : 'warn'}>
              Sentry capture {ready?.sentryCapture ? 'ready' : 'not configured'}
            </li>
            <li className={ready?.sentryManage ? 'ok' : 'warn'}>
              Sentry issue API {ready?.sentryManage ? 'ready' : 'not configured'}
            </li>
            <li className={ready?.sentryAssign ? 'ok' : 'warn'}>
              Sentry assignee {ready?.sentryAssign ? 'ready' : 'not configured'}
            </li>
          </>
        )}
      </ul>
      {statusError ? <p className="status warn">{statusError}</p> : null}

      <div className="panel-grid">
        <form
          className="panel"
          onSubmit={(event) => {
            event.preventDefault()
            const labels = parseLabels(jiraLabels)
            if (jiraAction === 'created') {
              void run({
                kind: 'jira.create',
                labels,
                assignment: jiraAssignment,
              })
              return
            }
            void run({
              kind: 'jira.update',
              issueKey: jiraIssueKey.trim() || undefined,
              labels,
              assignment: jiraAssignment,
            })
          }}
        >
          <h3>Jira</h3>
          <p className="hint">
            Filters use created or updated events, labels, and assignment.
          </p>
          <label>
            Event
            <select
              value={jiraAction}
              onChange={(event) =>
                setJiraAction(event.target.value as 'created' | 'updated')
              }
            >
              <option value="created">created</option>
              <option value="updated">updated</option>
            </select>
          </label>
          <label>
            Labels
            <input
              value={jiraLabels}
              onChange={(event) => setJiraLabels(event.target.value)}
              placeholder="intake-test"
            />
          </label>
          <label>
            Assignment
            <select
              value={jiraAssignment}
              onChange={(event) =>
                setJiraAssignment(event.target.value as JiraAssignment)
              }
            >
              <option value="unassigned">unassigned</option>
              <option value="assigned">assigned</option>
            </select>
          </label>
          {jiraAction === 'updated' ? (
            <label>
              Issue key
              <input
                value={jiraIssueKey}
                onChange={(event) => setJiraIssueKey(event.target.value)}
                placeholder="Leave empty to create a seed issue"
              />
            </label>
          ) : null}
          <button type="submit" disabled={busy || !ready?.jira}>
            {jiraAction === 'created' ? 'Create Jira issue' : 'Update Jira issue'}
          </button>
        </form>

        <form
          className="panel"
          onSubmit={(event) => {
            event.preventDefault()
            if (sentryAction === 'created') {
              void run({ kind: 'sentry.create', level: sentryLevel })
              return
            }
            if (sentryAction === 'unresolved') {
              void run({ kind: 'sentry.unresolved', level: sentryLevel })
              return
            }
            void run({ kind: 'sentry.assigned', level: sentryLevel })
          }}
        >
          <h3>Sentry</h3>
          <p className="hint">
            Filters use created, unresolved, and assigned actions plus level.
          </p>
          <label>
            Event
            <select
              value={sentryAction}
              onChange={(event) =>
                setSentryAction(event.target.value as SentryAction)
              }
            >
              <option value="created">created</option>
              <option value="unresolved">unresolved (regressed)</option>
              <option value="assigned">assigned</option>
            </select>
          </label>
          <label>
            Level
            <select
              value={sentryLevel}
              onChange={(event) =>
                setSentryLevel(event.target.value as SentryLevel)
              }
            >
              {SENTRY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={
              busy ||
              (sentryAction === 'created' && !ready?.sentryCapture) ||
              (sentryAction === 'unresolved' && !ready?.sentryManage) ||
              (sentryAction === 'assigned' && !ready?.sentryAssign)
            }
          >
            {sentryAction === 'created'
              ? 'Create Sentry issue'
              : sentryAction === 'unresolved'
                ? 'Regress Sentry issue'
                : 'Assign Sentry issue'}
          </button>
        </form>
      </div>

      <div className="matrix-actions">
        <button
          type="button"
          disabled={busy || !ready?.jira}
          onClick={() => void run({ kind: 'matrix', source: 'jira' }, true)}
        >
          Create Jira filter events
        </button>
        <button
          type="button"
          disabled={busy || !ready?.sentryCapture}
          onClick={() => void run({ kind: 'matrix', source: 'sentry' }, true)}
        >
          Create Sentry filter events
        </button>
        <button
          type="button"
          className="primary"
          disabled={busy || (!ready?.jira && !ready?.sentryCapture)}
          onClick={() => void run({ kind: 'matrix', source: 'all' }, true)}
        >
          Create all filter events
        </button>
      </div>
      <p className="hint">
        An updated Jira event can create a seed issue first. A Sentry regression
        creates, resolves, then reopens the same issue. An assignment creates
        the issue first.
      </p>

      <section className="result" aria-live="polite">
        {log.length === 0 ? (
          <p>Submit a form to create an intake event.</p>
        ) : (
          <ul className="log">
            {log.map((entry) => (
              <li key={entry.id} className={entry.ok ? 'ok' : 'warn'}>
                <span className="log-at">{entry.at}</span> {entry.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
