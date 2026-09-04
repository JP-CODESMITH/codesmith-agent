// Import the AgentResult type from feature types for type-safe result handling
import type { AgentResult as AgentResultType } from '~/features/agent/types'

// Props interface for the AgentResult component
interface AgentResultProps {
  result: AgentResultType // The agent result to display
}

// Display a styled result card showing the agent's status and message
export function AgentResult({ result }: AgentResultProps) {
  // Map each status to a corresponding border/background color scheme
  const statusStyles = {
    completed: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20', // Success styling
    failed: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',             // Error styling
    cancelled: 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20',    // Cancelled styling
    idle: 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20',         // Idle styling
    thinking: '',   // No special styling
    planning: '',   // No special styling
    executing: '',  // No special styling
    waiting: '',    // No special styling
    running: '',    // No special styling
  }

  return (
    <div className={`border rounded-lg p-4 ${statusStyles[result.status]}`}>
      {/* Status label and capitalized status name */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold">Status:</span>
        <span className="capitalize">{result.status}</span>
      </div>
      {/* The result message text */}
      <p className="text-sm">{result.message}</p>
    </div>
  )
}
