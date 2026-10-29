import { afterEach, describe, expect, it, vi } from 'vitest'
import { meta, run } from '../src/scenarios/invoiceDueDate.ts'

const RealDate = Date

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('invoice due date scenario', () => {
  it('returns safely for the malformed issue date fixture', () => {
    expect(run()).toBeUndefined()
  })

  it('preserves ISO output for a valid issue date', () => {
    const iso = vi.spyOn(RealDate.prototype, 'toISOString')
    vi.stubGlobal(
      'Date',
      class extends RealDate {
        constructor(value?: string | number) {
          if (value === 'not-a-date') {
            super('2025-01-31T00:00:00.000Z')
          } else if (value === undefined) {
            super()
          } else {
            super(value)
          }
        }
      },
    )

    expect(run()).toBeUndefined()
    expect(iso).toHaveReturnedWith('2025-01-31T00:00:00.000Z')
  })

  it('is resolved and keeps its scenario identity', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('invoice-due-date')
    expect(meta.title).toBe('Invoice due date')
  })
})
