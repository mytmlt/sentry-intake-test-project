import { describe, expect, it } from 'vitest'
import { run } from './sumCartTotal'

describe('sumCartTotal', () => {
  it('does not throw when the cart has no line items', () => {
    expect(() => run()).not.toThrow()
  })
})
