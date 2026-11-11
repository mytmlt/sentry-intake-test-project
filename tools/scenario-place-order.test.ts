import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/placeOrder.ts'

describe('placeOrder', () => {
  it('does not throw; receipt has order ord_200', async () => {
    await expect(run()).resolves.toBeUndefined()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('place-order')
    expect(meta.title).toBe('Place order')
  })
})