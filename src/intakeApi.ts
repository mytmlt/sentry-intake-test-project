import type {
  IntakeRequest,
  IntakeResult,
  StatusResult,
} from '../tools/types.ts'

export type { IntakeRequest, IntakeResult, StatusResult }

export async function fetchIntakeStatus(): Promise<StatusResult> {
  const response = await fetch('/api/intake/status')
  const payload = (await response.json()) as StatusResult & { error?: string }
  if (!response.ok) {
    throw new Error(payload.error ?? 'Could not load intake status.')
  }
  return payload
}

export async function runIntake(request: IntakeRequest): Promise<IntakeResult> {
  const response = await fetch('/api/intake/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const payload = (await response.json()) as IntakeResult & { error?: string }
  if (!response.ok) {
    throw new Error(payload.error ?? 'Intake request failed.')
  }
  return payload
}
