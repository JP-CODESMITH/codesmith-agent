// Import the factory function to create an AI provider instance
import { createAIProvider } from '~/ai/provider'
// Import the permission gate singleton for checking operation permissions
import { permissionGate } from '~/security/permissions'
// Import the factory function to create a new CodeSmith session
import { createCodeSmithSession } from '~/session/session'
// Import the factory function to create a tool registry
import { createToolRegistry } from '~/tools/registry'
// Import tool collections for filesystem, terminal, and git operations
import { filesystemTools } from '~/tools/filesystem'
import { gitTools } from '~/tools/git'
import { terminalTools } from '~/tools/terminal'
// Import the project detector to identify the user's project type
import { detectProject } from '~/project/detector'
// Import the agent turn runner function
import { runAgentTurn } from './loop'
// Import the result type for type safety
import type { AgentRunResult } from './types'

// This registry is the default Phase 1 tool surface.
// The agent receives tool definitions, but it does not invoke them autonomously yet.
export function createDefaultToolRegistry() {
  // Combine all available tool collections into a single registry
  return createToolRegistry([
    ...filesystemTools,
    ...terminalTools,
    ...gitTools,
  ])
}

// Run a single agent turn with the given message and project root
export async function runCodeSmithAgentTurn(
  message: string, // The user's goal/message for the agent
  projectRoot = process.cwd(), // Optional project root directory, defaults to current working directory
): Promise<AgentRunResult> {
  // A fresh in-memory session is created for each Phase 1 turn.
  // Persistence and multi-turn recovery are intentionally deferred.
  const project = detectProject(projectRoot) // Detect the project type and configuration
  const session = createCodeSmithSession(project) // Create a new session for this turn

  // Run the agent turn with all necessary components
  return runAgentTurn(
    {
      session,
      aiProvider: createAIProvider({ provider: 'placeholder' }), // Using placeholder provider; real LLM not yet connected
      permissions: permissionGate, // Use the global permission gate instance
      tools: createDefaultToolRegistry(), // Use the combined default tool registry
    },
    { message },
  )
}
