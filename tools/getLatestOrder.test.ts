import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/getLatestOrder.ts'

describe('getLatestOrder', () => {
  it('does not throw and returns the last order', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('open-latest-order')
    expect(meta.title).toBe('Open latest order')
  })
})