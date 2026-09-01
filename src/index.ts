import { runCodeSmithTui } from './ui/tui/app'

// Bun sets import.meta.main when this file is executed directly by `bun src/index.ts`.
// That makes this file the CLI entry point without changing the existing Vite app.
if (import.meta.main) {
  await runCodeSmithTui({ projectPath: process.cwd() })
}

export { runCodeSmithAgentTurn } from './agent/agent'
export { detectProject } from './project/detector'
