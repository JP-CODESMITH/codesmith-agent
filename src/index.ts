import { runCodeSmithTui } from './ui/tui/app'

if (import.meta.main) {
  await runCodeSmithTui({ projectPath: process.cwd() })
}

export { runCodeSmithAgentTurn } from './agent/agent'
export { detectProject } from './project/detector'
