import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/invoiceDueDate.ts'

describe('scenario invoice-due-date', () => {
  it('returns safely without throwing for malformed issue date', () => {
    expect(() => run()).not.toThrow()
  })

  it('is resolved', () => {
    expect(meta.resolved).toBe(true)
  })
})