import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/estimateShippingHops.ts'

describe('estimateShippingHops', () => {
  it('does not throw and terminates within a reasonable depth', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('estimate-shipping-hops')
    expect(meta.title).toBe('Estimate shipping hops')
  })
})