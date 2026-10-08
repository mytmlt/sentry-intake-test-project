import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/formatTax.ts'

describe('formatTax', () => {
  it('does not throw when run', () => {
    expect(run).not.toThrow()
  })

  it('is marked resolved', () => {
    expect(meta.resolved).toBe(true)
  })
})