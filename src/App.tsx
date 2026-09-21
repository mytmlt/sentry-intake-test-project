import { useMemo, useState } from 'react'
import * as Sentry from '@sentry/react'
import { isSentryConfigured } from './instrument'
import { loadActiveScenarios } from './scenarios'
import type { ActiveScenario } from './scenarios/types'
import './App.css'

type LabResult =
  | { kind: 'idle' }
  | { kind: 'ok'; title: string }
  | { kind: 'error'; title: string; name: string; message: string }

function triggerScenario(scenario: ActiveScenario): LabResult {
  return Sentry.withScope((scope) => {
    scope.setTag('scenario', scenario.meta.id)
    scope.setFingerprint(['harbor-shop', scenario.meta.id])

    try {
      scenario.run()
      return { kind: 'ok', title: scenario.meta.title }
    } catch (error) {
      Sentry.captureException(error)
      const err = error instanceof Error ? error : new Error(String(error))
      return {
        kind: 'error',
        title: scenario.meta.title,
        name: err.name,
        message: err.message,
      }
    }
  })
}

function App() {
  const scenarios = useMemo(() => loadActiveScenarios(), [])
  const sentryReady = isSentryConfigured()
  const [result, setResult] = useState<LabResult>({ kind: 'idle' })

  return (
    <div className="lab">
      <header className="hero">
        <p className="kicker">Harbor Shop</p>
        <h1>Sentry Error Lab</h1>
        <p className="lede">
          Ten real storefront crashes. Each button reports a distinct Sentry
          issue Superplane can patch. After a fix sets{' '}
          <code>meta.resolved</code> to <code>true</code>, that button
          disappears.
        </p>
        <p className={sentryReady ? 'status ok' : 'status warn'} role="status">
          {sentryReady
            ? 'Sentry DSN loaded — clicks will create issues.'
            : 'No VITE_SENTRY_DSN in .env.local — errors stay local only.'}
        </p>
        <p className="count">{scenarios.length} open crashes</p>
      </header>

      {scenarios.length === 0 ? (
        <p className="empty">All Harbor Shop crashes are fixed.</p>
      ) : (
        <ul className="grid">
          {scenarios.map((scenario) => (
            <li key={scenario.meta.id} className="card">
              <h2>{scenario.meta.title}</h2>
              <p>{scenario.meta.description}</p>
              <code className="path">{scenario.file}</code>
              <button
                type="button"
                onClick={() => setResult(triggerScenario(scenario))}
              >
                Trigger error
              </button>
            </li>
          ))}
        </ul>
      )}

      <section className="result" aria-live="polite">
        {result.kind === 'idle' ? (
          <p>Click a button to fire a crash.</p>
        ) : result.kind === 'ok' ? (
          <p>
            <strong>{result.title}</strong> completed without throwing. If this
            still shows in the lab, set <code>meta.resolved</code> to{' '}
            <code>true</code>.
          </p>
        ) : (
          <p>
            <strong>{result.title}</strong>
            <br />
            {result.name}: {result.message}
            {sentryReady ? ' — sent to Sentry.' : ' — not sent (missing DSN).'}
          </p>
        )}
      </section>
    </div>
  )
}

export default App
