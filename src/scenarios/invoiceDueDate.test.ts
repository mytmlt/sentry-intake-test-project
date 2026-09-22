import { describe, expect, it } from 'vitest'
import { dueDateIso, run } from './invoiceDueDate'

describe('dueDateIso', () => {
  it('adds net-30 days to a valid issued-on timestamp', () => {
    expect(dueDateIso('2026-09-01T00:00:00.000Z')).toBe('2026-10-01T00:00:00.000Z')
  })

  it('falls back instead of throwing on a malformed issued-on field', () => {
    expect(dueDateIso('not-a-date')).toBe('2026-10-01T00:00:00.000Z')
  })
})

describe('run', () => {
  it('does not throw', () => {
    expect(() => run()).not.toThrow()
  })
})
