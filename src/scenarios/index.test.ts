import { describe, expect, it } from 'vitest'
import { loadActiveScenarios } from './index'
import * as allocateStockSlots from './allocateStockSlots'
import * as applyCoupon from './applyCoupon'
import * as decodeSearchQuery from './decodeSearchQuery'
import * as estimateShippingHops from './estimateShippingHops'
import * as formatTax from './formatTax'
import * as getLatestOrder from './getLatestOrder'
import * as invoiceDueDate from './invoiceDueDate'
import * as loadCustomerProfile from './loadCustomerProfile'
import * as placeOrder from './placeOrder'
import * as sumCartTotal from './sumCartTotal'
import type { ScenarioModule } from './types'

// Every entry in src/scenarios/*.ts (except index.ts and types.ts) must be
// registered here so the invariants below cover the whole crash lab.
const scenarioModules: ScenarioModule[] = [
  allocateStockSlots,
  applyCoupon,
  decodeSearchQuery,
  estimateShippingHops,
  formatTax,
  getLatestOrder,
  invoiceDueDate,
  loadCustomerProfile,
  placeOrder,
  sumCartTotal,
]

describe('scenario modules', () => {
  it('have unique ids', () => {
    const ids = scenarioModules.map((mod) => mod.meta.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(scenarioModules.map((mod) => [mod.meta.title, mod] as const))(
    'keeps meta.resolved honest for "%s"',
    (_title, mod) => {
      // The lab's contract (see README.md) is: an unresolved scenario's
      // run() throws, and a fixed scenario's run() does not. If a fix lands
      // without flipping meta.resolved, or resolved gets flipped without a
      // real fix, this test catches the mismatch.
      if (mod.meta.resolved) {
        expect(() => mod.run()).not.toThrow()
      } else {
        expect(() => mod.run()).toThrow()
      }
    },
  )
})

describe('loadActiveScenarios', () => {
  it('excludes resolved scenarios', () => {
    const resolvedIds = new Set(
      scenarioModules.filter((mod) => mod.meta.resolved).map((mod) => mod.meta.id),
    )
    const activeIds = loadActiveScenarios().map((scenario) => scenario.meta.id)

    for (const id of resolvedIds) {
      expect(activeIds).not.toContain(id)
    }
  })

  it('includes every unresolved scenario exactly once', () => {
    const unresolvedIds = scenarioModules
      .filter((mod) => !mod.meta.resolved)
      .map((mod) => mod.meta.id)
      .sort()
    const activeIds = loadActiveScenarios()
      .map((scenario) => scenario.meta.id)
      .sort()

    expect(activeIds).toEqual(unresolvedIds)
  })

  it('sorts active scenarios by title', () => {
    const titles = loadActiveScenarios().map((scenario) => scenario.meta.title)
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)))
  })

  it('reports a file path under src/scenarios for each active scenario', () => {
    for (const scenario of loadActiveScenarios()) {
      expect(scenario.file).toMatch(/^src\/scenarios\/[A-Za-z]+\.ts$/)
    }
  })
})
