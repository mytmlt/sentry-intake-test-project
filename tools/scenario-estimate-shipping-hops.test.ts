import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/estimateShippingHops.ts'

describe('estimate-shipping-hops scenario', () => {
  it('run() completes without throwing and produces a finite hop count', () => {
    expect(() => run()).not.toThrow()
  })

  it('scenario metadata is correct', () => {
    expect(meta).toMatchObject({
      id: 'estimate-shipping-hops',
      title: 'Estimate shipping hops',
      resolved: true,
    })
  })
})