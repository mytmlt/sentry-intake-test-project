export class IntakeError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'IntakeError'
    this.statusCode = statusCode
  }
}

export function isIntakeError(error: unknown): error is IntakeError {
  return error instanceof IntakeError
}
