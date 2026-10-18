import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/applyCoupon.ts'

describe('applyCoupon', () => {
  it('does not throw for a valid discount payload', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('apply-coupon')
    expect(meta.title).toBe('Apply coupon')
  })
})