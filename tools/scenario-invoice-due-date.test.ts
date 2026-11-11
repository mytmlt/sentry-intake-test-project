import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/invoiceDueDate.ts'

describe('invoiceDueDate', () => {
  it('does not throw for an invalid issue date', () => {
    expect(() => run()).not.toThrow()
  })

  it('exports resolved metadata', () => {
    expect(meta).toMatchObject({
      id: 'invoice-due-date',
      title: 'Invoice due date',
      resolved: true,
    })
  })
})