import { afterEach, describe, expect, it, vi } from 'vitest'
import { meta, run } from '../src/scenarios/invoiceDueDate.ts'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('invoiceDueDate', () => {
  it('returns without serializing the malformed issue date', () => {
    const serialize = vi.spyOn(Date.prototype, 'toISOString')

    expect(run()).toBeUndefined()
    expect(serialize).not.toHaveBeenCalled()
  })

  it.each([
    ['2024-02-29', '2024-02-29T00:00:00.000Z'],
    ['2026-10-29T12:30:00+02:00', '2026-10-29T10:30:00.000Z'],
  ])('preserves ISO serialization for issue date %s', (issuedOn, expected) => {
    const serialize = vi.spyOn(Date.prototype, 'toISOString')
    vi.stubGlobal('Date', class extends Date {
      constructor() {
        super(issuedOn)
      }
    })

    expect(run()).toBeUndefined()
    expect(serialize).toHaveBeenCalledOnce()
    expect(serialize).toHaveReturnedWith(expected)
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('invoice-due-date')
    expect(meta.title).toBe('Invoice due date')
  })
})
