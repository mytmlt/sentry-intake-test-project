import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/lookupShippingAddress.ts'

describe('lookupShippingAddress', () => {
  it('throws when geocoding returns null for an unsupported region', () => {
    expect(() => run()).toThrow()
  })

  it('has correct meta fields', () => {
    expect(meta.resolved).toBe(false)
    expect(meta.id).toBe('lookup-shipping-address')
    expect(meta.title).toBe('Lookup shipping address')
  })
})