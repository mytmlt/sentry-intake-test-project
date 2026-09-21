import type { ActiveScenario, ScenarioModule } from './types'

const modules = import.meta.glob('./*.ts', { eager: true }) as Record<
  string,
  Partial<ScenarioModule>
>

const skipped = new Set(['./index.ts', './types.ts'])

export function loadActiveScenarios(): ActiveScenario[] {
  return Object.entries(modules)
    .filter(([path]) => !skipped.has(path))
    .filter(([, mod]) => mod.meta && typeof mod.run === 'function')
    .filter(([, mod]) => !mod.meta?.resolved)
    .map(([path, mod]) => ({
      meta: mod.meta!,
      run: mod.run!,
      file: `src/scenarios/${path.slice(2)}`,
    }))
    .sort((a, b) => a.meta.title.localeCompare(b.meta.title))
}
