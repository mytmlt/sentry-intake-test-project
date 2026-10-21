import { describe, expect, it } from 'vitest'
import * as allocateStockSlots from '../src/scenarios/allocateStockSlots.ts'
import * as applyCoupon from '../src/scenarios/applyCoupon.ts'
import * as decodeSearchQuery from '../src/scenarios/decodeSearchQuery.ts'
import * as estimateShippingHops from '../src/scenarios/estimateShippingHops.ts'
import * as formatTax from '../src/scenarios/formatTax.ts'
import * as getLatestOrder from '../src/scenarios/getLatestOrder.ts'
import * as invoiceDueDate from '../src/scenarios/invoiceDueDate.ts'
import * as loadCustomerProfile from '../src/scenarios/loadCustomerProfile.ts'
import * as placeOrder from '../src/scenarios/placeOrder.ts'
import * as sumCartTotal from '../src/scenarios/sumCartTotal.ts'
import type { ScenarioModule } from '../src/scenarios/types.ts'

const unresolved: Array<{ mod: ScenarioModule; error: new (...args: never[]) => Error }> = [
  { mod: sumCartTotal, error: TypeError },
  { mod: decodeSearchQuery, error: URIError },
  { mod: allocateStockSlots, error: RangeError },
  { mod: getLatestOrder, error: TypeError },
  { mod: formatTax, error: TypeError },
  { mod: estimateShippingHops, error: RangeError },
  { mod: placeOrder, error: TypeError },
  { mod: invoiceDueDate, error: RangeError },
]

const resolved: ScenarioModule[] = [applyCoupon, loadCustomerProfile]

describe('browser crash scenarios', () => {
  it('throws the documented error while unresolved', () => {
    for (const { mod, error } of unresolved) {
      expect(mod.meta.resolved, mod.meta.id).toBe(false)
      expect(mod.run, mod.meta.id).toThrow(error)
    }
  })

  it('does not throw once marked resolved', () => {
    for (const mod of resolved) {
      expect(mod.meta.resolved, mod.meta.id).toBe(true)
      expect(mod.run, mod.meta.id).not.toThrow()
    }
  })

  it('keeps unique ids and titles', () => {
    const modules = [...unresolved.map(({ mod }) => mod), ...resolved]
    const ids = modules.map((mod) => mod.meta.id)
    const titles = modules.map((mod) => mod.meta.title)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(titles).size).toBe(titles.length)
    expect(ids).toEqual([
      'sum-cart-total',
      'decode-search-query',
      'allocate-stock-slots',
      'open-latest-order',
      'format-tax',
      'estimate-shipping-hops',
      'place-order',
      'invoice-due-date',
      'apply-coupon',
      'load-customer-profile',
    ])
  })
})
