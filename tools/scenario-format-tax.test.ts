import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/formatTax.ts'

describe('scenario format-tax', () => {
  it('formats the price correctly', () => {
    run()
  })

  it('exports resolved metadata', () => {
    expect(meta.id).toBe('format-tax')
    expect(meta.title).toBe('Format tax')
    expect(meta.resolved).toBe(true)
  })
})