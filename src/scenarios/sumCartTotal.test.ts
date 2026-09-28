import { describe, expect, it } from 'vitest'
import { meta, run } from './sumCartTotal'

describe('sum cart total scenario', () => {
  it('handles a cart before its items have loaded', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved after the crash is fixed', () => {
    expect(meta.resolved).toBe(true)
  })
})
