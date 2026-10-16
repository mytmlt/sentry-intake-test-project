import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/loadCustomerProfile.ts'

describe('loadCustomerProfile', () => {
  it('does not throw for a guest customer with a null profile', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('load-customer-profile')
    expect(meta.title).toBe('Load customer profile')
  })
})
