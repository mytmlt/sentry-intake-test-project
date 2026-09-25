import { describe, expect, it } from 'vitest'
import { IntakeError, isIntakeError } from './errors.ts'

describe('IntakeError', () => {
  it('sets the name and default status code', () => {
    const error = new IntakeError('something went wrong')
    expect(error.name).toBe('IntakeError')
    expect(error.message).toBe('something went wrong')
    expect(error.statusCode).toBe(400)
  })

  it('accepts a custom status code', () => {
    const error = new IntakeError('not found', 404)
    expect(error.statusCode).toBe(404)
  })
})

describe('isIntakeError', () => {
  it('returns true for IntakeError instances', () => {
    expect(isIntakeError(new IntakeError('bad'))).toBe(true)
  })

  it('returns false for regular errors', () => {
    expect(isIntakeError(new Error('bad'))).toBe(false)
  })

  it('returns false for non-error values', () => {
    expect(isIntakeError('string')).toBe(false)
    expect(isIntakeError(null)).toBe(false)
    expect(isIntakeError(undefined)).toBe(false)
    expect(isIntakeError(42)).toBe(false)
  })
})