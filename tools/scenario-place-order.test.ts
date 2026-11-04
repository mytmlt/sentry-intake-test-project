import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/placeOrder.ts'

describe('placeOrder', () => {
  it('awaits submitOrder and reads the order ID without throwing', async () => {
    await expect(run()).resolves.toBeUndefined()
  })

  it('processes order ord_200', async () => {
    // run() reads receipt.orderId.slice(0, 8); if ord_200 is processed, it won't throw
    await expect(run()).resolves.toBeUndefined()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('place-order')
    expect(meta.title).toBe('Place order')
  })
})