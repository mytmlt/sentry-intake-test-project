import { describe, expect, it } from 'vitest'
import { stockLabel, stockStatus } from './stock.ts'

describe('stockStatus', () => {
  it('marks zero and negative counts as out of stock', () => {
    expect(stockStatus(0)).toBe('out-of-stock')
    expect(stockStatus(-3)).toBe('out-of-stock')
  })

  it('marks remaining units at or below the threshold as low stock', () => {
    expect(stockStatus(1)).toBe('low-stock')
    expect(stockStatus(5)).toBe('low-stock')
  })

  it('marks counts above the threshold as in stock', () => {
    expect(stockStatus(6)).toBe('in-stock')
  })
})

describe('stockLabel', () => {
  it('describes availability for shoppers', () => {
    expect(stockLabel(0)).toBe('Out of stock')
    expect(stockLabel(3)).toBe('3 left')
    expect(stockLabel(18)).toBe('In stock (18)')
  })
})
