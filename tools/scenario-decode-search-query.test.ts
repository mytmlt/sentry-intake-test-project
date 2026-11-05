import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/decodeSearchQuery.ts'

describe('decodeSearchQuery', () => {
  it('preserves a malformed query when URI decoding fails', () => {
    expect(() => run()).not.toThrow()
    expect(run()).toBe('%')
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('decode-search-query')
    expect(meta.title).toBe('Decode search query')
  })
})
