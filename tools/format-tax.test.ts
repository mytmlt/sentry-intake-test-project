import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/formatTax.ts'

describe('formatTax', () => {
  it('run() completes without throwing and meta.resolved is true', () => {
    run()
    expect(meta.resolved).toBe(true)
  })
})