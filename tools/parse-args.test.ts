import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { CLI_HELP, parseArgv } from './parse-args.ts'

const DOCUMENTED_TOKENS = [
  '--summary',
  '--no-labels',
  '--issue-key',
  'unresolved',
  'assigned',
  'intake-test',
  'unassigned',
  'error',
]

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

  it('documents all flags in CLI_HELP and the README CLI section', () => {
    const readme = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../README.md'),
      'utf8',
    )
    const cliStart = readme.indexOf('## CLI')
    const matrixStart = readme.indexOf('## Matrix')
    const cliSection = readme.slice(cliStart, matrixStart)

    for (const token of DOCUMENTED_TOKENS) {
      expect(CLI_HELP).toContain(token)
      expect(cliSection).toContain(token)
    }
  })

  it('rejects unknown levels', () => {
    expect(() => parseArgv(['sentry', 'create', '--level', 'log'])).toThrow(
      'Level must be fatal, error, warning, info, or debug.',
    )
  })
})
