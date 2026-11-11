import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/formatTax.ts'

describe('scenario: formatTax', () => {
  it('formats the catalog price and completes without throwing', () => {
    expect(() => run()).not.toThrow()
  })

  it('meta.resolved is true', () => {
    expect(meta.resolved).toBe(true)
  })

  it('meta.id is format-tax', () => {
    expect(meta.id).toBe('format-tax')
  })

  it('meta.title is Format tax', () => {
    expect(meta.title).toBe('Format tax')
  })
})