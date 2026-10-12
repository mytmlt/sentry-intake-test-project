import { describe, expect, it } from 'vitest'
import { parseJson, parseJsonSafe } from './http.ts'
import { IntakeError } from './errors.ts'

describe('parseJson', () => {
  it('parses valid JSON', () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 })
  })

  it('returns null for empty body', () => {
    expect(parseJson('')).toBeNull()
    expect(parseJson('  ')).toBeNull()
  })

  it('throws IntakeError for invalid JSON', () => {
    expect(() => parseJson('not json')).toThrow(IntakeError)
    expect(() => parseJson('{invalid}')).toThrow('Upstream returned invalid JSON.')
  })
})

describe('parseJsonSafe', () => {
  it('returns parsed JSON on success', () => {
    expect(parseJsonSafe('[1,2,3]')).toEqual([1, 2, 3])
  })

  it('returns null on parse failure', () => {
    expect(parseJsonSafe('')).toBeNull()
    expect(parseJsonSafe('not json')).toBeNull()
  })
})