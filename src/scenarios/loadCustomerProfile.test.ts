import { describe, expect, it } from 'vitest'
import { meta, resolveEmail, run } from './loadCustomerProfile'

describe('loadCustomerProfile', () => {
  it('falls back to a guest email when the profile is null', () => {
    expect(resolveEmail({ id: 'guest', profile: null })).toBe(
      'guest@harbor-shop.example',
    )
  })

  it('uses the real profile email when one is present', () => {
    expect(
      resolveEmail({
        id: 'cus_1',
        profile: { email: 'ada@example.com', name: 'Ada' },
      }),
    ).toBe('ada@example.com')
  })

  it('runs without throwing', () => {
    expect(() => run()).not.toThrow()
  })

  it('reports itself as resolved', () => {
    expect(meta.resolved).toBe(true)
  })
})
