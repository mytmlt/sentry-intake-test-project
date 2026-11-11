import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/placeOrder.ts'

describe('place-order scenario', () => {
  it('awaits submitOrder and reads the order ID from the receipt', async () => {
    await run()

    expect(meta).toMatchObject({
      id: 'place-order',
      title: 'Place order',
      resolved: true,
    })
  })
})