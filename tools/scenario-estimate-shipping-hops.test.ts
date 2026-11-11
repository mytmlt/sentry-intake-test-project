import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/estimateShippingHops.ts'

describe('estimateShippingHops', () => {
  it('does not overflow the stack when warehouses repeat', () => {
    expect(() => run()).not.toThrow()
  })

  it('sets meta.resolved to true', () => {
    expect(meta.resolved).toBe(true)
  })
})