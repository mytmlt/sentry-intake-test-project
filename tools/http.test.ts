import { describe, expect, it } from 'vitest'
import { parseJson, parseJsonSafe } from './http.ts'

describe('parseJson', () => {
  it('returns null for an empty body', () => {
    expect(parseJson('')).toBeNull()
    expect(parseJson('  ')).toBeNull()
  })

  it('parses valid JSON', () => {
    expect(parseJson('{"key":"value"}')).toEqual({ key: 'value' })
    expect(parseJson('[1,2,3]')).toEqual([1, 2, 3])
  })

  it('throws for invalid JSON', () => {
    expect(() => parseJson('not json')).toThrow('Upstream returned invalid JSON.')
  })
})

describe('parseJsonSafe', () => {
  it('returns null for invalid JSON', () => {
    expect(parseJsonSafe('not json')).toBeNull()
  })

  it('returns null for an empty body', () => {
    expect(parseJsonSafe('')).toBeNull()
  })

  it('parses valid JSON', () => {
    expect(parseJsonSafe('{"key":"value"}')).toEqual({ key: 'value' })
  })
})