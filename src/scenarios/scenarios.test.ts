import { describe, expect, it } from 'vitest'

import * as loadCustomerProfile from './loadCustomerProfile.ts'
import * as sumCartTotal from './sumCartTotal.ts'
import * as applyCoupon from './applyCoupon.ts'
import * as decodeSearchQuery from './decodeSearchQuery.ts'
import * as allocateStockSlots from './allocateStockSlots.ts'
import * as getLatestOrder from './getLatestOrder.ts'
import * as formatTax from './formatTax.ts'
import * as estimateShippingHops from './estimateShippingHops.ts'
import * as placeOrder from './placeOrder.ts'
import * as invoiceDueDate from './invoiceDueDate.ts'
import type { ScenarioModule } from './types.ts'

const allScenarios: Array<{ file: string; mod: ScenarioModule }> = [
  { file: 'loadCustomerProfile.ts', mod: loadCustomerProfile },
  { file: 'sumCartTotal.ts', mod: sumCartTotal },
  { file: 'applyCoupon.ts', mod: applyCoupon },
  { file: 'decodeSearchQuery.ts', mod: decodeSearchQuery },
  { file: 'allocateStockSlots.ts', mod: allocateStockSlots },
  { file: 'getLatestOrder.ts', mod: getLatestOrder },
  { file: 'formatTax.ts', mod: formatTax },
  { file: 'estimateShippingHops.ts', mod: estimateShippingHops },
  { file: 'placeOrder.ts', mod: placeOrder },
  { file: 'invoiceDueDate.ts', mod: invoiceDueDate },
]

describe('scenario modules export the required shape', () => {
  for (const { file, mod } of allScenarios) {
    it(`${file} exports meta with id, title, description, and resolved`, () => {
      expect(mod.meta).toBeDefined()
      expect(typeof mod.meta.id).toBe('string')
      expect(mod.meta.id.length).toBeGreaterThan(0)
      expect(typeof mod.meta.title).toBe('string')
      expect(mod.meta.title.length).toBeGreaterThan(0)
      expect(typeof mod.meta.description).toBe('string')
      expect(typeof mod.meta.resolved).toBe('boolean')
    })

    it(`${file} exports a run function`, () => {
      expect(typeof mod.run).toBe('function')
    })
  }

  it('every scenario has a unique id', () => {
    const ids = allScenarios.map(({ mod }) => mod.meta.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('unresolved scenarios throw the expected errors', () => {
  it('loadCustomerProfile throws TypeError', () => {
    expect(loadCustomerProfile.meta.resolved).toBe(false)
    expect(() => loadCustomerProfile.run()).toThrow(TypeError)
  })

  it('sumCartTotal throws TypeError', () => {
    expect(sumCartTotal.meta.resolved).toBe(false)
    expect(() => sumCartTotal.run()).toThrow(TypeError)
  })

  it('decodeSearchQuery throws URIError', () => {
    expect(decodeSearchQuery.meta.resolved).toBe(false)
    expect(() => decodeSearchQuery.run()).toThrow(URIError)
  })

  it('allocateStockSlots throws RangeError', () => {
    expect(allocateStockSlots.meta.resolved).toBe(false)
    expect(() => allocateStockSlots.run()).toThrow(RangeError)
  })

  it('getLatestOrder throws TypeError', () => {
    expect(getLatestOrder.meta.resolved).toBe(false)
    expect(() => getLatestOrder.run()).toThrow(TypeError)
  })

  it('formatTax throws TypeError', () => {
    expect(formatTax.meta.resolved).toBe(false)
    expect(() => formatTax.run()).toThrow(TypeError)
  })

  it('estimateShippingHops throws RangeError (stack overflow)', () => {
    expect(estimateShippingHops.meta.resolved).toBe(false)
    expect(() => estimateShippingHops.run()).toThrow(RangeError)
  })

  it('placeOrder throws TypeError', () => {
    expect(placeOrder.meta.resolved).toBe(false)
    expect(() => placeOrder.run()).toThrow(TypeError)
  })

  it('invoiceDueDate throws RangeError', () => {
    expect(invoiceDueDate.meta.resolved).toBe(false)
    expect(() => invoiceDueDate.run()).toThrow(RangeError)
  })
})

describe('resolved scenarios do not throw', () => {
  it('applyCoupon runs without error', () => {
    expect(applyCoupon.meta.resolved).toBe(true)
    expect(() => applyCoupon.run()).not.toThrow()
  })
})
