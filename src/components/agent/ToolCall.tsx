// Import the ToolCall type from the agent feature types for type safety
import type { ToolCall as ToolCallType } from '~/features/agent/types'

// Props interface for the ToolCall component
interface ToolCallProps {
  call: ToolCallType // The tool call data to display
}

// Display a single tool call with its input parameters and optional result
export function ToolCall({ call }: ToolCallProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm">
      {/* Header showing the tool name and its status badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-blue-600 dark:text-blue-400">
          {call.tool}
        </span>
        <ToolCallStatus status={call.status} />
      </div>
      {/* Display the input parameters as formatted JSON */}
      <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
        {JSON.stringify(call.input, null, 2)}
      </pre>
      {/* Conditionally show the result if one exists and is not null */}
      {call.result !== undefined && call.result !== null && (
        <pre className="mt-2 text-xs text-green-600 dark:text-green-400 overflow-x-auto">
          {JSON.stringify(call.result, null, 2)}
        </pre>
      )}
    </div>
  )
}

// Display a colored status badge based on the tool call's current state
function ToolCallStatus({ status }: { status: ToolCallType['status'] }) {
  // Map each status to a corresponding Tailwind CSS color class
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',    // Waiting to execute
    running: 'bg-blue-100 text-blue-800',        // Currently executing
    completed: 'bg-green-100 text-green-800',    // Finished successfully
    failed: 'bg-red-100 text-red-800',           // Errored out
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  )
}
