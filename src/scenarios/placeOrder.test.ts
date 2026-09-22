import { describe, expect, it } from 'vitest'
import { meta, placeOrder, run } from './placeOrder.ts'

describe('placeOrder', () => {
  it('awaits checkout and returns the receipt order id', async () => {
    const receipt = await placeOrder()
    expect(receipt.orderId).toBe('ord_200')
    expect(receipt.orderId.slice(0, 8)).toBe('ord_200')
  })

  it('run completes without throwing after the receipt resolves', async () => {
    await expect(run()).resolves.toBeUndefined()
  })

  it('marks the crash as resolved', () => {
    expect(meta.resolved).toBe(true)
  })
})
