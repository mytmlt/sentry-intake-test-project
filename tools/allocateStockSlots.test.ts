import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/allocateStockSlots.ts'

describe('allocateStockSlots', () => {
  it('does not throw for a negative stock count', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('allocate-stock-slots')
    expect(meta.title).toBe('Allocate stock slots')
  })
})