import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/benchmarkPrices.ts'

describe('benchmarkPrices', () => {
  it('throws when the benchmark entry is undefined', () => {
    expect(() => run()).toThrow()
  })

  it('is marked unresolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(false)
    expect(meta.id).toBe('benchmark-prices')
    expect(meta.title).toBe('Benchmark prices')
  })
})