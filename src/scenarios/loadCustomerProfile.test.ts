import { describe, expect, it } from 'vitest'
import { getCustomerEmail, meta, run } from './loadCustomerProfile'

describe('loadCustomerProfile', () => {
  it('falls back to a guest email when the profile is missing', () => {
    expect(getCustomerEmail({ id: 'guest', profile: null })).toBe('guest@harborshop.example')
  })

  it('uses the real email when a profile is present', () => {
    expect(
      getCustomerEmail({ id: 'user_1', profile: { email: 'a@b.com', name: 'A' } }),
    ).toBe('a@b.com')
  })

  it('no longer throws for the guest scenario', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved', () => {
    expect(meta.resolved).toBe(true)
  })
})
