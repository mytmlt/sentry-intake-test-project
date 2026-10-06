import { describe, expect, it } from 'vitest'
import { loadActiveScenarios } from './index.ts'
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
import type { ScenarioModule } from './types.ts'

const scenarios: Array<ScenarioModule & { file: string }> = [
  { ...allocateStockSlots, file: 'src/scenarios/allocateStockSlots.ts' },
  { ...applyCoupon, file: 'src/scenarios/applyCoupon.ts' },
  { ...decodeSearchQuery, file: 'src/scenarios/decodeSearchQuery.ts' },
  { ...estimateShippingHops, file: 'src/scenarios/estimateShippingHops.ts' },
  { ...formatTax, file: 'src/scenarios/formatTax.ts' },
  { ...getLatestOrder, file: 'src/scenarios/getLatestOrder.ts' },
  { ...invoiceDueDate, file: 'src/scenarios/invoiceDueDate.ts' },
  { ...loadCustomerProfile, file: 'src/scenarios/loadCustomerProfile.ts' },
  { ...placeOrder, file: 'src/scenarios/placeOrder.ts' },
  { ...sumCartTotal, file: 'src/scenarios/sumCartTotal.ts' },
]

const expectedErrorName: Record<string, string | undefined> = {
  'allocate-stock-slots': 'RangeError',
  'apply-coupon': undefined,
  'decode-search-query': 'URIError',
  'estimate-shipping-hops': 'RangeError',
  'format-tax': 'TypeError',
  'invoice-due-date': 'RangeError',
  'load-customer-profile': 'TypeError',
  'open-latest-order': 'TypeError',
  'place-order': 'TypeError',
  'sum-cart-total': 'TypeError',
}

function thrownBy(run: () => void): unknown {
  try {
    run()
    return undefined
  } catch (error) {
    return error
  }
}

describe('crash scenarios', () => {
  it('covers every Harbor Shop crash button', () => {
    expect(scenarios).toHaveLength(10)
    expect(new Set(scenarios.map((scenario) => scenario.meta.id)).size).toBe(scenarios.length)
  })

  it('throws the documented error only while the scenario is unresolved', () => {
    for (const scenario of scenarios) {
      const error = thrownBy(scenario.run)
      const expected = expectedErrorName[scenario.meta.id]
      expect(scenario.meta.id in expectedErrorName, scenario.meta.id).toBe(true)
      expect(scenario.meta.title.length, scenario.meta.id).toBeGreaterThan(0)
      expect(scenario.meta.description.length, scenario.meta.id).toBeGreaterThan(0)

      if (scenario.meta.resolved) {
        expect(error, scenario.meta.id).toBeUndefined()
        expect(expected, scenario.meta.id).toBeUndefined()
        continue
      }

      expect(error, scenario.meta.id).toBeInstanceOf(Error)
      expect((error as Error).name, scenario.meta.id).toBe(expected)
    }
  })
})

describe('loadActiveScenarios', () => {
  it('lists unresolved scenarios once, sorted by title, with a source path', () => {
    const active = loadActiveScenarios()
    const unresolved = scenarios.filter((scenario) => !scenario.meta.resolved)

    expect(active.map((scenario) => scenario.meta.id).sort()).toEqual(
      unresolved.map((scenario) => scenario.meta.id).sort(),
    )
    expect(active.map((scenario) => scenario.meta.title)).toEqual(
      [...active.map((scenario) => scenario.meta.title)].sort((left, right) =>
        left.localeCompare(right),
      ),
    )

    for (const scenario of active) {
      const source = scenarios.find((item) => item.meta.id === scenario.meta.id)
      expect(source, scenario.meta.id).toBeDefined()
      expect(scenario.file).toBe(source?.file)
      expect(scenario.run).toBe(source?.run)
      expect(scenario.file.endsWith('.test.ts')).toBe(false)
    }
  })
})
