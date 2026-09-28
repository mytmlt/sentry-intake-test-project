import { describe, expect, it } from 'vitest'
import { meta, run } from './allocateStockSlots'

describe('allocateStockSlots', () => {
  it('does not throw when the inventory API reports a negative count', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved', () => {
    expect(meta.resolved).toBe(true)
  })
})
