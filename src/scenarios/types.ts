export type ScenarioMeta = {
  id: string
  title: string
  description: string
  resolved: boolean
}

export type ScenarioModule = {
  meta: ScenarioMeta
  run: () => void | Promise<void>
}

export type ActiveScenario = ScenarioModule & {
  file: string
}
