import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/invoiceDueDate.ts'

describe('invoice due date scenario', () => {
  it('does not throw on the malformed invoice issue date', () => {
    expect(() => run()).not.toThrow()
  })

  it('sets resolved to true', () => {
    expect(meta.resolved).toBe(true)
  })
})