import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/sumCartTotal.ts'

describe('sumCartTotal', () => {
  it('does not throw for a cart with undefined items', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('sum-cart-total')
    expect(meta.title).toBe('Sum cart total')
  })
})