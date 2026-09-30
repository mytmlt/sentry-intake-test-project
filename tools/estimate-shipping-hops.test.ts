import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/estimateShippingHops.ts'

describe('estimateShippingHops', () => {
  it('completes without throwing a stack overflow', () => {
    expect(() => run()).not.toThrow()
  })

  it('completes repeatedly without retaining traversal state', () => {
    expect(() => run()).not.toThrow()
    expect(() => run()).not.toThrow()
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its identity', () => {
    expect(meta.id).toBe('estimate-shipping-hops')
    expect(meta.resolved).toBe(true)
  })
})
