import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/estimateShippingHops.ts'

describe('estimateShippingHops', () => {
  it('run() completes without throwing and meta.resolved is true', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('estimate-shipping-hops')
    expect(() => run()).not.toThrow()
  })
})