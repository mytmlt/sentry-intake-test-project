export type Clock = {
  sleep(ms: number): Promise<void>
}

export const systemClock: Clock = {
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },
}

export const instantClock: Clock = {
  async sleep() {
    return undefined
  },
}

export class RetryableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RetryableError'
  }
}

export async function retry<T>(
  operation: () => Promise<T>,
  options: {
    attempts: number
    delayMs: number
    clock: Clock
    shouldRetry: (error: unknown) => boolean
  },
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      const hasAttemptsLeft = attempt < options.attempts
      if (!hasAttemptsLeft || !options.shouldRetry(error)) {
        throw error
      }
      const waitMs = Math.round(options.delayMs * 1.5 ** (attempt - 1))
      await options.clock.sleep(waitMs)
    }
  }

  throw lastError
}
