import { describe, expect, it } from 'vitest'
import { CLI_HELP, parseArgv } from './parse-args.ts'

describe('parseArgv', () => {
  it('parses Jira create flags', () => {
    expect(
      parseArgv([
        'jira',
        'create',
        '--labels',
        'intake-test,factory',
        '--assignment',
        'assigned',
        '--issue-type',
        'Bug',
      ]),
    ).toEqual({
      kind: 'jira.create',
      labels: ['intake-test', 'factory'],
      assignment: 'assigned',
      issueType: 'Bug',
      summary: undefined,
    })
  })

  it('parses a seeded Jira update and Sentry regress alias', () => {
    expect(parseArgv(['jira', 'update', '--no-labels'])).toMatchObject({
      kind: 'jira.update',
      labels: [],
      assignment: 'unassigned',
    })
    expect(parseArgv(['sentry', 'regress', '--level', 'fatal'])).toEqual({
      kind: 'sentry.unresolved',
      level: 'fatal',
    })
  })

  it('defaults matrix source to all', () => {
    expect(parseArgv(['matrix'])).toEqual({ kind: 'matrix', source: 'all' })
    expect(parseArgv(['matrix', 'sentry'])).toEqual({
      kind: 'matrix',
      source: 'sentry',
    })
  })

  it('rejects unknown levels', () => {
    expect(() => parseArgv(['sentry', 'create', '--level', 'log'])).toThrow(
      'Level must be fatal, error, warning, info, or debug.',
    )
  })

  it('documents all CLI flags in CLI_HELP', () => {
    expect(CLI_HELP).toContain('--summary')
    expect(CLI_HELP).toContain('--no-labels')
    expect(CLI_HELP).toContain('--issue-key')
  })
})
