import { describe, expect, it } from 'vitest'
import { RetryableError, instantClock, retry } from './retry.ts'

describe('retry', () => {
  it('retries retryable failures until the operation succeeds', async () => {
    let attempts = 0
    const value = await retry(
      async () => {
        attempts += 1
        if (attempts < 3) {
          throw new RetryableError('not yet')
        }
        return 'ok'
      },
      {
        attempts: 5,
        delayMs: 10,
        clock: instantClock,
        shouldRetry: (error) => error instanceof RetryableError,
      },
    )
    expect(value).toBe('ok')
    expect(attempts).toBe(3)
  })

  it('does not retry non-retryable errors', async () => {
    let attempts = 0
    await expect(
      retry(
        async () => {
          attempts += 1
          throw new Error('boom')
        },
        {
          attempts: 4,
          delayMs: 10,
          clock: instantClock,
          shouldRetry: (error) => error instanceof RetryableError,
        },
      ),
    ).rejects.toThrow('boom')
    expect(attempts).toBe(1)
  })
})
