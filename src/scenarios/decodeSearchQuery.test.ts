import { describe, expect, it } from 'vitest'

import { decodeSearchQuery, meta, run } from './decodeSearchQuery'

describe('decodeSearchQuery', () => {
  it('decodes a well-formed percent-encoded value', () => {
    expect(decodeSearchQuery('hello%20world')).toBe('hello world')
  })

  it('falls back to the raw value on malformed percent-encoding', () => {
    expect(decodeSearchQuery('%')).toBe('%')
    expect(decodeSearchQuery('100% off')).toBe('100% off')
  })

  it('run() no longer throws', () => {
    expect(() => run()).not.toThrow()
  })

  it('reports the scenario as resolved', () => {
    expect(meta.resolved).toBe(true)
  })
})
