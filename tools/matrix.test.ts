import { describe, expect, it } from 'vitest'
import { jiraMatrix, sentryMatrix } from './matrix.ts'

describe('matrix', () => {
  it('expands Jira created/updated with labels and assignment', () => {
    const cells = jiraMatrix()
    expect(cells).toHaveLength(8)
    expect(cells).toContainEqual({
      action: 'created',
      assignment: 'assigned',
      labels: ['intake-test'],
    })
    expect(cells).toContainEqual({
      action: 'updated',
      assignment: 'unassigned',
      labels: [],
    })
  })

  it('expands Sentry actions across intake levels', () => {
    const cells = sentryMatrix()
    expect(cells).toHaveLength(15)
    expect(cells).toContainEqual({ action: 'created', level: 'fatal' })
    expect(cells).toContainEqual({ action: 'unresolved', level: 'debug' })
    expect(cells).toContainEqual({ action: 'assigned', level: 'warning' })
  })
})
