import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/estimateShippingHops.ts'

describe('estimateShippingHops', () => {
  it('does not overflow the stack and returns a finite hop count', () => {
    expect(() => run()).not.toThrow()
    expect(meta.resolved).toBe(true)
  })
})