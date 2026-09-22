import { useEffect, useMemo, useRef, useState } from 'react'
import * as Sentry from '@sentry/react'
import { isSentryConfigured } from './instrument'
import { CartPanel } from './CartPanel'
import { IntakePanels } from './IntakePanels'
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
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const copiedResetRef = useRef<number>(undefined)

  useEffect(() => {
    return () => {
      window.clearTimeout(copiedResetRef.current)
    }
  }, [])

  async function copyPath(path: string) {
    if (!navigator.clipboard?.writeText) {
      return
    }

    try {
      await navigator.clipboard.writeText(path)
      window.clearTimeout(copiedResetRef.current)
      setCopiedPath(path)
      copiedResetRef.current = window.setTimeout(() => {
        setCopiedPath(null)
      }, 2000)
    } catch {
      return
    }
  }

  return (
    <div className="lab">
      <header className="hero">
        <p className="kicker">Harbor Shop</p>
        <h1>Intake Test Lab</h1>
        <p className="lede">
          Create Jira and Sentry events that match SuperPlane factory intake
          filters. Crash buttons still send browser errors SuperPlane can
          patch.
        </p>
        <p className={sentryReady ? 'status ok' : 'status warn'} role="status">
          {sentryReady
            ? 'Browser Sentry DSN loaded. Crash clicks create issues.'
            : 'No VITE_SENTRY_DSN in .env.local. Crash errors stay local.'}
        </p>
      </header>

      <CartPanel />

      <IntakePanels />

      <section className="crashes">
        <div className="section-head">
          <h2>Browser crash scenarios</h2>
          <p>
            Each button reports a distinct Sentry issue. After a fix sets{' '}
            <code>meta.resolved</code> to <code>true</code>, that button
            disappears.
          </p>
          <p className="count">{scenarios.length} open crashes</p>
        </div>

        {scenarios.length === 0 ? (
          <p className="empty">All Harbor Shop crashes are fixed.</p>
        ) : (
          <ul className="grid">
            {scenarios.map((scenario) => (
              <li key={scenario.meta.id} className="card">
                <h2>{scenario.meta.title}</h2>
                <p>{scenario.meta.description}</p>
                <div className="path-row">
                  <code className="path">{scenario.file}</code>
                  <button
                    type="button"
                    className="copy-path"
                    onClick={() => {
                      void copyPath(scenario.file)
                    }}
                  >
                    {copiedPath === scenario.file ? 'Copied' : 'Copy path'}
                  </button>
                </div>
                <button
                  type="button"
                  className="trigger"
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
            <p>Click a crash button to fire a browser error.</p>
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
              {sentryReady
                ? ' Sent to Sentry.'
                : ' Not sent. Missing DSN.'}
            </p>
          )}
        </section>
      </section>
    </div>
  )
}

export default App
