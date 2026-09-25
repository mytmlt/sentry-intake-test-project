import { describe, expect, it } from 'vitest'
import { meta, run } from './formatTax.ts'

describe('formatTax', () => {
  it('no longer throws when the catalog price arrives as a string', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved so it drops off the Error Lab dashboard', () => {
    expect(meta.resolved).toBe(true)
  })
})
