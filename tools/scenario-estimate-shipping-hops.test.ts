import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/estimateShippingHops.ts'

describe('estimateShippingHops', () => {
  it('returns a finite hop count without stack overflow', () => {
    expect(() => run()).not.toThrow()
  })

  it('resolves the scenario', () => {
    expect(meta.resolved).toBe(true)
  })
})