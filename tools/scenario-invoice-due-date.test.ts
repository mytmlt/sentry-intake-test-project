import { afterEach, describe, expect, it, vi } from 'vitest'
import { meta, run } from '../src/scenarios/invoiceDueDate.ts'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('invoiceDueDate', () => {
  it('returns undefined without throwing or serializing the malformed issue date', () => {
    const serialize = vi.spyOn(Date.prototype, 'toISOString')

    expect(run()).toBeUndefined()
    expect(serialize).not.toHaveBeenCalled()
  })

  it('preserves ISO serialization for a valid issue date', () => {
    const issuedOn = '2026-11-05T12:30:00.000Z'
    const RealDate = Date
    vi.stubGlobal('Date', class extends RealDate {
      constructor() {
        super(issuedOn)
      }
    })
    const serialize = vi.spyOn(RealDate.prototype, 'toISOString')

    expect(run()).toBeUndefined()
    expect(serialize).toHaveBeenCalledOnce()
    expect(serialize.mock.results[0]?.value).toBe(issuedOn)
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('invoice-due-date')
    expect(meta.title).toBe('Invoice due date')
  })
})
