import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { config as loadDotenv } from 'dotenv'
import { configSecrets, parseConfig } from './config.ts'
import { assembleDeps } from './deps.ts'
import { isIntakeError } from './errors.ts'
import { executeIntake } from './operations.ts'
import { CLI_HELP, parseArgv } from './parse-args.ts'
import { redactSecrets } from './redact.ts'
import type { IntakeResult } from './types.ts'

export function loadCliEnv(
  cwd = process.cwd(),
): Record<string, string | undefined> {
  loadDotenv({ path: resolve(cwd, '.env') })
  loadDotenv({ path: resolve(cwd, '.env.local'), override: true })
  return process.env
}

function printResult(result: IntakeResult): void {
  console.log(JSON.stringify(result, null, 2))
}

export async function main(
  argv: string[],
  env: Record<string, string | undefined> = process.env,
): Promise<number> {
  try {
    const parsed = parseArgv(argv)
    if (parsed.kind === 'help') {
      console.log(CLI_HELP)
      return 0
    }
    const { deps } = assembleDeps(env)
    const result = await executeIntake(parsed, deps)
    printResult(result)
    return 0
  } catch (error) {
    const secrets = configSecrets(parseConfig(env))
    const message = redactSecrets(
      error instanceof Error ? error.message : String(error),
      secrets,
    )
    console.error(message)
    if (isIntakeError(error)) {
      return 1
    }
    return 1
  }
}

function isCliEntry(): boolean {
  const entry = process.argv[1]
  if (!entry) {
    return false
  }
  return import.meta.url === pathToFileURL(entry).href
}

if (isCliEntry()) {
  main(process.argv.slice(2), loadCliEnv())
    .then((code) => {
      process.exitCode = code
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    })
}
