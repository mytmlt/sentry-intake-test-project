import { describe, expect, it } from 'vitest'
import { meta, run, serializeDueDate } from '../src/scenarios/invoiceDueDate.ts'

describe('invoiceDueDate', () => {
  it('does not throw for a malformed issue date', () => {
    expect(() => run()).not.toThrow()
  })

  it('keeps valid dates in ISO format', () => {
    expect(serializeDueDate('2026-10-29')).toBe('2026-10-29T00:00:00.000Z')
  })

  it('keeps its identity and is marked resolved', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('invoice-due-date')
    expect(meta.title).toBe('Invoice due date')
  })
})
