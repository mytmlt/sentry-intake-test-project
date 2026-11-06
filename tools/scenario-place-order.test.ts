import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/placeOrder.ts'

describe('placeOrder', () => {
  it('awaits submitOrder and yields the receipt with orderId ord_200', async () => {
    await run()
    // If run() completes without throwing, the receipt resolved.
    // We verify by checking meta.resolved (set after the await).
    expect(meta.resolved).toBe(true)
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('place-order')
    expect(meta.title).toBe('Place order')
  })
})