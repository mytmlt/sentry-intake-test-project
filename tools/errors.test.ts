import { describe, expect, it } from 'vitest'
import { IntakeError, isIntakeError } from './errors.ts'

describe('IntakeError', () => {
  it('uses a default status code of 400', () => {
    const error = new IntakeError('bad request')
    expect(error.message).toBe('bad request')
    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('IntakeError')
  })

  it('accepts a custom status code', () => {
    const error = new IntakeError('not found', 404)
    expect(error.message).toBe('not found')
    expect(error.statusCode).toBe(404)
  })
})

describe('isIntakeError', () => {
  it('returns true for IntakeError instances', () => {
    expect(isIntakeError(new IntakeError(''))).toBe(true)
    expect(isIntakeError(new IntakeError('oops', 502))).toBe(true)
  })

  it('returns false for generic Error instances', () => {
    expect(isIntakeError(new Error(''))).toBe(false)
  })

  it('returns false for non-Error values', () => {
    expect(isIntakeError('string')).toBe(false)
    expect(isIntakeError(null)).toBe(false)
    expect(isIntakeError(undefined)).toBe(false)
    expect(isIntakeError({})).toBe(false)
  })
})