// Import the TUI runner function from the terminal UI module
import { runCodeSmithTui } from './ui/tui/app'

// Bun automatically sets import.meta.main to true when this file is executed directly
// (e.g., via `bun src/index.ts`), making this the CLI entry point without affecting the Vite app
if (import.meta.main) {
  // Start the terminal UI with the current working directory as the project root
  await runCodeSmithTui({ projectPath: process.cwd() })
}

// Re-export functions so they can be used by other modules or external consumers
export { runCodeSmithAgentTurn } from './agent/agent'
export { detectProject } from './project/detector'
