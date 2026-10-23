import { describe, expect, it, vi } from 'vitest'
import { createIntakeMiddleware } from './vite-plugin.ts'

describe('createIntakeMiddleware', () => {
  it('calls next() for non-intake paths', async () => {
    const req = { url: '/index.html' }
    const res = { statusCode: 0, setHeader: vi.fn(), end: vi.fn() }
    const next = vi.fn()
    await createIntakeMiddleware({})(req as any, res as any, next)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.end).not.toHaveBeenCalled()
  })

  it('returns 500 JSON error when readBody throws', async () => {
    const req = {
      url: '/api/intake/run',
      method: 'POST',
      [Symbol.asyncIterator]() {
        return {
          next() {
            return new Promise((_, reject) => reject(new Error('connection lost')))
          },
        }
      },
    }
    const res = { statusCode: 0, setHeader: vi.fn(), end: vi.fn() }
    const next = vi.fn()
    await createIntakeMiddleware({})(req as any, res as any, next)
    expect(res.statusCode).toBe(500)
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
    const [body] = res.end.mock.calls[0]
    expect(JSON.parse(body)).toEqual({ error: 'connection lost' })
    expect(next).not.toHaveBeenCalled()
  })
})