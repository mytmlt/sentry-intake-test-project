import { afterEach, describe, expect, it, vi } from 'vitest'
import { invoiceDueDateIso, meta, run } from '../src/scenarios/invoiceDueDate.ts'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('invoiceDueDate', () => {
  it('returns undefined without serializing the malformed issue date', () => {
    const serialize = vi.spyOn(Date.prototype, 'toISOString')

    expect(run()).toBeUndefined()
    expect(serialize).not.toHaveBeenCalled()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('invoice-due-date')
    expect(meta.title).toBe('Invoice due date')
  })

  it.each([
    ['2026-10-29', '2026-10-29T00:00:00.000Z'],
    ['2026-10-29T15:30:00+02:00', '2026-10-29T13:30:00.000Z'],
  ])('preserves ISO output for valid issue date %s', (issuedOn, expected) => {
    expect(invoiceDueDateIso(issuedOn)).toBe(expected)
  })
})
