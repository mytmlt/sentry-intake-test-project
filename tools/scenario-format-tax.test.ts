import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/formatTax.ts'

describe('formatTax scenario', () => {
  it('formats the catalog price without throwing', () => {
    expect(run).not.toThrow()
  })

  it('has meta.resolved set to true', () => {
    expect(meta.resolved).toBe(true)
  })
})