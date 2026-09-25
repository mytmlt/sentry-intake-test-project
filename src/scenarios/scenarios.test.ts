/**
 * Unit tests for Harbor Shop crash scenarios.
 *
 * Each unresolved scenario must throw so that the Sentry trigger button has
 * something to capture. Each resolved scenario must not throw and must have
 * meta.resolved === true so it is hidden from the dashboard.
 */

import { describe, expect, it } from 'vitest'
import * as allocateStockSlots from './allocateStockSlots.ts'
import * as applyCoupon from './applyCoupon.ts'
import * as decodeSearchQuery from './decodeSearchQuery.ts'
import * as estimateShippingHops from './estimateShippingHops.ts'
import * as formatTax from './formatTax.ts'
import * as getLatestOrder from './getLatestOrder.ts'
import * as invoiceDueDate from './invoiceDueDate.ts'
import * as loadCustomerProfile from './loadCustomerProfile.ts'
import * as placeOrder from './placeOrder.ts'
import * as sumCartTotal from './sumCartTotal.ts'

// ---------------------------------------------------------------------------
// Unresolved crash scenarios — run() must throw
// ---------------------------------------------------------------------------

describe('loadCustomerProfile (unresolved)', () => {
  it('meta.resolved is false', () => {
    expect(loadCustomerProfile.meta.resolved).toBe(false)
  })

  it('run() throws a TypeError reading email on a null profile', () => {
    expect(() => loadCustomerProfile.run()).toThrow(TypeError)
  })
})

describe('sumCartTotal (unresolved)', () => {
  it('meta.resolved is false', () => {
    expect(sumCartTotal.meta.resolved).toBe(false)
  })

  it('run() throws a TypeError calling reduce on undefined', () => {
    expect(() => sumCartTotal.run()).toThrow(TypeError)
  })
})

describe('decodeSearchQuery (unresolved)', () => {
  it('meta.resolved is false', () => {
    expect(decodeSearchQuery.meta.resolved).toBe(false)
  })

  it('run() throws a URIError on a malformed percent sequence', () => {
    expect(() => decodeSearchQuery.run()).toThrow(URIError)
  })
})

describe('allocateStockSlots (unresolved)', () => {
  it('meta.resolved is false', () => {
    expect(allocateStockSlots.meta.resolved).toBe(false)
  })

  it('run() throws a RangeError for a negative array length', () => {
    expect(() => allocateStockSlots.run()).toThrow(RangeError)
  })
})

describe('getLatestOrder (unresolved)', () => {
  it('meta.resolved is false', () => {
    expect(getLatestOrder.meta.resolved).toBe(false)
  })

  it('run() throws a TypeError from an off-by-one index', () => {
    expect(() => getLatestOrder.run()).toThrow(TypeError)
  })
})

describe('formatTax (unresolved)', () => {
  it('meta.resolved is false', () => {
    expect(formatTax.meta.resolved).toBe(false)
  })

  it('run() throws a TypeError because a string has no .toFixed', () => {
    expect(() => formatTax.run()).toThrow(TypeError)
  })
})

describe('estimateShippingHops (unresolved)', () => {
  it('meta.resolved is false', () => {
    expect(estimateShippingHops.meta.resolved).toBe(false)
  })

  it('run() throws a RangeError from infinite recursion', () => {
    expect(() => estimateShippingHops.run()).toThrow(RangeError)
  })
})

describe('placeOrder (unresolved)', () => {
  it('meta.resolved is false', () => {
    expect(placeOrder.meta.resolved).toBe(false)
  })

  it('run() throws a TypeError reading .orderId on a Promise', () => {
    expect(() => placeOrder.run()).toThrow(TypeError)
  })
})

describe('invoiceDueDate (unresolved)', () => {
  it('meta.resolved is false', () => {
    expect(invoiceDueDate.meta.resolved).toBe(false)
  })

  it('run() throws a RangeError for an invalid time value', () => {
    expect(() => invoiceDueDate.run()).toThrow(RangeError)
  })
})

// ---------------------------------------------------------------------------
// Resolved scenario — run() must succeed and meta.resolved must be true
// ---------------------------------------------------------------------------

describe('applyCoupon (resolved)', () => {
  it('meta.resolved is true', () => {
    expect(applyCoupon.meta.resolved).toBe(true)
  })

  it('run() completes without throwing', () => {
    expect(() => applyCoupon.run()).not.toThrow()
  })
})
