import { describe, expect, it } from 'vitest'
import { meta as allocateMeta, run as allocateRun } from '../src/scenarios/allocateStockSlots.ts'
import { meta as applyMeta, run as applyRun } from '../src/scenarios/applyCoupon.ts'
import { meta as decodeMeta, run as decodeRun } from '../src/scenarios/decodeSearchQuery.ts'
import { meta as estimateMeta, run as estimateRun } from '../src/scenarios/estimateShippingHops.ts'
import { meta as formatMeta, run as formatRun } from '../src/scenarios/formatTax.ts'
import { meta as invoiceMeta, run as invoiceRun } from '../src/scenarios/invoiceDueDate.ts'
import { meta as latestMeta, run as latestRun } from '../src/scenarios/getLatestOrder.ts'
import { meta as orderMeta, run as orderRun } from '../src/scenarios/placeOrder.ts'
import { meta as sumMeta, run as sumRun } from '../src/scenarios/sumCartTotal.ts'
import { meta as profileMeta, run as profileRun } from '../src/scenarios/loadCustomerProfile.ts'

const scenarios: { meta: typeof allocateMeta; run: () => void }[] = [
  { meta: allocateMeta, run: allocateRun },
  { meta: applyMeta, run: applyRun },
  { meta: decodeMeta, run: decodeRun },
  { meta: estimateMeta, run: estimateRun },
  { meta: formatMeta, run: formatRun },
  { meta: invoiceMeta, run: invoiceRun },
  { meta: latestMeta, run: latestRun },
  { meta: orderMeta, run: orderRun },
  { meta: sumMeta, run: sumRun },
  { meta: profileMeta, run: profileRun },
]

const resolved = new Set(['apply-coupon', 'load-customer-profile'])

describe('scenario crash contract', () => {
  it.each(scenarios)('$meta.id — meta has required fields', ({ meta }) => {
    expect(meta.id).toBeTruthy()
    expect(meta.title).toBeTruthy()
    expect(meta.description).toBeTruthy()
    expect(typeof meta.resolved).toBe('boolean')
    expect(meta.id).toMatch(/^[a-z0-9-]+$/)
  })

  it('scenario ids are unique', () => {
    const ids = scenarios.map((s) => s.meta.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(scenarios.filter((s) => resolved.has(s.meta.id)))(
    '$meta.id — resolved scenario does not throw',
    ({ run }) => {
      expect(() => run()).not.toThrow()
    },
  )

  it.each(scenarios.filter((s) => !resolved.has(s.meta.id)))(
    '$meta.id — unresolved scenario throws',
    ({ run }) => {
      expect(() => run()).toThrow()
    },
  )

  it.each(scenarios.filter((s) => s.meta.id === 'allocate-stock-slots'))(
    'allocate-stock-slots throws RangeError',
    ({ run }) => {
      expect(() => run()).toThrow(RangeError)
    },
  )

  it.each(scenarios.filter((s) => s.meta.id === 'decode-search-query'))(
    'decode-search-query throws URIError',
    ({ run }) => {
      expect(() => run()).toThrow(URIError)
    },
  )

  it.each(scenarios.filter((s) => s.meta.id === 'estimate-shipping-hops'))(
    'estimate-shipping-hops throws RangeError',
    ({ run }) => {
      expect(() => run()).toThrow(RangeError)
    },
  )

  it.each(scenarios.filter((s) => s.meta.id === 'format-tax'))(
    'format-tax throws TypeError',
    ({ run }) => {
      expect(() => run()).toThrow(TypeError)
    },
  )

  it.each(scenarios.filter((s) => s.meta.id === 'invoice-due-date'))(
    'invoice-due-date throws RangeError',
    ({ run }) => {
      expect(() => run()).toThrow(RangeError)
    },
  )

  it.each(scenarios.filter((s) => s.meta.id === 'open-latest-order'))(
    'open-latest-order throws TypeError',
    ({ run }) => {
      expect(() => run()).toThrow(TypeError)
    },
  )

  it.each(scenarios.filter((s) => s.meta.id === 'place-order'))(
    'place-order throws TypeError',
    ({ run }) => {
      expect(() => run()).toThrow(TypeError)
    },
  )

  it.each(scenarios.filter((s) => s.meta.id === 'sum-cart-total'))(
    'sum-cart-total throws TypeError',
    ({ run }) => {
      expect(() => run()).toThrow(TypeError)
    },
  )

  it.each(scenarios.filter((s) => resolved.has(s.meta.id)))(
    '$meta.id — meta.resolved is true',
    ({ meta }) => {
      expect(meta.resolved).toBe(true)
    },
  )

  it.each(scenarios.filter((s) => !resolved.has(s.meta.id)))(
    '$meta.id — meta.resolved is false',
    ({ meta }) => {
      expect(meta.resolved).toBe(false)
    },
  )
})