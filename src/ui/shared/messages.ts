// Import the session type for type-safe access to session data
import type { CodeSmithSession } from '~/session/types'

// Format a human-readable project summary string from the current session's project info
export function formatProjectSummary(session: CodeSmithSession): string {
  // Join the detected project types into a comma-separated string, or 'unknown' if none found
  const types = session.project.types.length
    ? session.project.types.join(', ')
    : 'unknown'
  // Join the detected entry points into a comma-separated string, or a fallback message
  const entries = session.project.entryPoints.length
    ? session.project.entryPoints.join(', ')
    : 'none detected'

  return [
    `Project: ${session.project.root}`,          // Absolute path to the project root
    `Type: ${types}`,                              // Detected project type (e.g., node, python)
    `Package manager: ${session.project.packageManager ?? 'unknown'}`, // Detected package manager
    `Git: ${session.project.hasGit ? 'yes' : 'no'}`, // Whether the project has a .git directory
    `Entry points: ${entries}`,                    // Main source entry point files detected
  ].join('\n') // Join all summary lines with newlines for display
}
