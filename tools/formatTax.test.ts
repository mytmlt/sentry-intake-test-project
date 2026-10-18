import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/formatTax.ts'

describe('formatTax', () => {
  it('does not throw when the catalog price is a string', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('format-tax')
    expect(meta.title).toBe('Format tax')
  })
})