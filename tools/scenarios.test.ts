import { describe, expect, it } from 'vitest'
import {
  meta as allocateStockSlotsMeta,
  run as allocateStockSlots,
} from '../src/scenarios/allocateStockSlots.ts'
import { meta as applyCouponMeta, run as applyCoupon } from '../src/scenarios/applyCoupon.ts'
import {
  meta as decodeSearchQueryMeta,
  run as decodeSearchQuery,
} from '../src/scenarios/decodeSearchQuery.ts'
import {
  meta as estimateShippingHopsMeta,
  run as estimateShippingHops,
} from '../src/scenarios/estimateShippingHops.ts'
import { meta as formatTaxMeta, run as formatTax } from '../src/scenarios/formatTax.ts'
import {
  meta as getLatestOrderMeta,
  run as getLatestOrder,
} from '../src/scenarios/getLatestOrder.ts'
import {
  meta as invoiceDueDateMeta,
  run as invoiceDueDate,
} from '../src/scenarios/invoiceDueDate.ts'
import {
  meta as loadCustomerProfileMeta,
  run as loadCustomerProfile,
} from '../src/scenarios/loadCustomerProfile.ts'
import { meta as placeOrderMeta, run as placeOrder } from '../src/scenarios/placeOrder.ts'
import { meta as sumCartTotalMeta, run as sumCartTotal } from '../src/scenarios/sumCartTotal.ts'
import type { ScenarioMeta } from '../src/scenarios/types.ts'

type ScenarioCase = {
  id: string
  title: string
  meta: ScenarioMeta
  run: () => void
  error?: new (...args: never[]) => Error
}

const openScenarios: ScenarioCase[] = [
  {
    id: 'allocate-stock-slots',
    title: 'Allocate stock slots',
    meta: allocateStockSlotsMeta,
    run: allocateStockSlots,
    error: RangeError,
  },
  {
    id: 'decode-search-query',
    title: 'Decode search query',
    meta: decodeSearchQueryMeta,
    run: decodeSearchQuery,
    error: URIError,
  },
  {
    id: 'estimate-shipping-hops',
    title: 'Estimate shipping hops',
    meta: estimateShippingHopsMeta,
    run: estimateShippingHops,
    error: RangeError,
  },
  {
    id: 'format-tax',
    title: 'Format tax',
    meta: formatTaxMeta,
    run: formatTax,
    error: TypeError,
  },
  {
    id: 'invoice-due-date',
    title: 'Invoice due date',
    meta: invoiceDueDateMeta,
    run: invoiceDueDate,
    error: RangeError,
  },
  {
    id: 'open-latest-order',
    title: 'Open latest order',
    meta: getLatestOrderMeta,
    run: getLatestOrder,
    error: TypeError,
  },
  {
    id: 'place-order',
    title: 'Place order',
    meta: placeOrderMeta,
    run: placeOrder,
    error: TypeError,
  },
  {
    id: 'sum-cart-total',
    title: 'Sum cart total',
    meta: sumCartTotalMeta,
    run: sumCartTotal,
    error: TypeError,
  },
]

const resolvedScenarios: ScenarioCase[] = [
  {
    id: 'apply-coupon',
    title: 'Apply coupon',
    meta: applyCouponMeta,
    run: applyCoupon,
  },
  {
    id: 'load-customer-profile',
    title: 'Load customer profile',
    meta: loadCustomerProfileMeta,
    run: loadCustomerProfile,
  },
]

describe('browser crash scenarios', () => {
  it.each(openScenarios)(
    '$title stays unresolved and throws $error.name',
    ({ id, title, meta, run, error }) => {
      expect(meta).toMatchObject({ id, title, resolved: false })
      expect(run).toThrow(error)
    },
  )

  it.each(resolvedScenarios)(
    '$title stays resolved and does not throw',
    ({ id, title, meta, run }) => {
      expect(meta).toMatchObject({ id, title, resolved: true })
      expect(run).not.toThrow()
    },
  )
})
