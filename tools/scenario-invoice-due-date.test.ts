import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/invoiceDueDate.ts'

describe('invoiceDueDate', () => {
  it('does not throw for a malformed issued-on date', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('invoice-due-date')
    expect(meta.title).toBe('Invoice due date')
  })
})
