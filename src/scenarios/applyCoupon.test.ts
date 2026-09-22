import { describe, expect, it } from 'vitest'
import { applyCoupon, parseCouponPayload, run } from './applyCoupon.ts'

describe('parseCouponPayload', () => {
  it('parses a valid discount payload', () => {
    expect(parseCouponPayload('{"code": "SAVE10", "percent": 10}')).toEqual({
      code: 'SAVE10',
      percent: 10,
    })
  })

  it('recovers a truncated marketing-email payload', () => {
    expect(parseCouponPayload('{"code": "SAVE10", "percent": 10')).toEqual({
      code: 'SAVE10',
      percent: 10,
    })
  })

  it('returns null for garbage without throwing', () => {
    expect(parseCouponPayload('not-json')).toBeNull()
    expect(parseCouponPayload('{"percent": 10}')).toBeNull()
    expect(parseCouponPayload('{"code": "", "percent": 10}')).toBeNull()
  })
})

describe('applyCoupon', () => {
  it('applies a percent discount at checkout', () => {
    expect(applyCoupon(100, '{"code": "SAVE10", "percent": 10}')).toBe(90)
  })

  it('leaves the subtotal unchanged when the payload cannot be applied', () => {
    expect(applyCoupon(80, 'broken')).toBe(80)
  })
})

describe('run', () => {
  it('does not throw on the checkout coupon payload', () => {
    expect(() => run()).not.toThrow()
  })
})
