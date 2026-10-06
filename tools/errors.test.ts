import { describe, expect, it } from 'vitest'
import { IntakeError, isIntakeError } from './errors.ts'

describe('isIntakeError', () => {
  it('returns true for IntakeError instances', () => {
    const error = new IntakeError('test')
    expect(isIntakeError(error)).toBe(true)
  })

  it('returns false for standard Error instances', () => {
    expect(isIntakeError(new Error('test'))).toBe(false)
  })

  it('returns false for non-Error values', () => {
    expect(isIntakeError('string')).toBe(false)
    expect(isIntakeError(null)).toBe(false)
    expect(isIntakeError(undefined)).toBe(false)
    expect(isIntakeError(42)).toBe(false)
  })
})

describe('IntakeError', () => {
  it('defaults statusCode to 400', () => {
    const error = new IntakeError('test')
    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('IntakeError')
  })

  it('accepts a custom statusCode', () => {
    const error = new IntakeError('not found', 404)
    expect(error.statusCode).toBe(404)
  })
})