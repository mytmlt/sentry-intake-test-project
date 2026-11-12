import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/sumCartTotal.ts'

describe('sumCartTotal', () => {
  it('does not throw on an empty cart with no items', () => {
    expect(() => run()).not.toThrow()
  })

  it('reports the scenario as resolved', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('sum-cart-total')
    expect(meta.title).toBe('Sum cart total')
  })
})