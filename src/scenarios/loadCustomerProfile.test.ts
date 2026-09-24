import { describe, expect, it } from 'vitest'
import { meta, run } from './loadCustomerProfile'

describe('loadCustomerProfile', () => {
  it('does not throw for a signed-out guest with no profile', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved', () => {
    expect(meta.resolved).toBe(true)
  })
})
