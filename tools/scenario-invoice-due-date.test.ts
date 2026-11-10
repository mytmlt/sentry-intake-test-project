import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/invoiceDueDate.ts'

describe('invoiceDueDate', () => {
  it('does not throw for malformed issued-on date', () => {
    expect(() => run()).not.toThrow()
  })

  it('marks the scenario as resolved', () => {
    expect(meta.resolved).toBe(true)
  })
})