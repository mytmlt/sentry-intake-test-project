import { describe, expect, it } from 'vitest'
import { meta, run } from '../src/scenarios/decodeSearchQuery.ts'

describe('decodeSearchQuery', () => {
  it('does not throw for a truncated percent-encoded query', () => {
    expect(() => run()).not.toThrow()
  })

  it('is marked resolved and keeps its id and title', () => {
    expect(meta.resolved).toBe(true)
    expect(meta.id).toBe('decode-search-query')
    expect(meta.title).toBe('Decode search query')
  })
})