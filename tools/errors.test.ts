import { describe, expect, it } from 'vitest'
import { IntakeError, isIntakeError } from './errors.ts'

describe('IntakeError', () => {
  it('creates an error with a message and default status code', () => {
    const error = new IntakeError('bad request')
    expect(error.message).toBe('bad request')
    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('IntakeError')
  })

  it('accepts a custom status code', () => {
    const error = new IntakeError('not found', 404)
    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('not found')
  })
})

describe('isIntakeError', () => {
  it('returns true for IntakeError instances', () => {
    expect(isIntakeError(new IntakeError('test'))).toBe(true)
  })

  it('returns false for other errors', () => {
    expect(isIntakeError(new Error('test'))).toBe(false)
  })

  it('returns false for non-error values', () => {
    expect(isIntakeError('string')).toBe(false)
    expect(isIntakeError(null)).toBe(false)
    expect(isIntakeError(undefined)).toBe(false)
    expect(isIntakeError(42)).toBe(false)
  })
})