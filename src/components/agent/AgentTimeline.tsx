// Import the AgentStatus type for type-safe status handling
import type { AgentStatus } from '~/features/agent/types'

// Props interface for the AgentTimeline component
interface AgentTimelineProps {
  status: AgentStatus // Current agent status (shown as indicator)
  events: string[]    // List of event messages to display in the timeline
}

// Display the agent's status indicator and a chronological list of events
export function AgentTimeline({ status, events }: AgentTimelineProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      {/* Status row: colored dot + capitalized status label */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <StatusIndicator status={status} />
        <span className="capitalize">{status}</span>
      </div>

      {/* Show empty state or the list of events */}
      {events.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-600 text-sm">
          No task running.
        </p>
      ) : (
        <ul className="space-y-1">
          {/* Render each event as a checklist item with a green checkmark */}
          {events.map((event, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm"
            >
              <span className="mt-0.5 text-green-500">&#x2713;</span>
              <span>{event}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Display a colored dot indicating the current agent status
function StatusIndicator({ status }: { status: AgentStatus }) {
  if (status === 'idle') {
    return <span className="w-2 h-2 rounded-full bg-gray-400" /> // Gray = waiting
  }
  if (status === 'failed') {
    return <span className="w-2 h-2 rounded-full bg-red-500" /> // Red = error
  }
  return <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> // Blue + pulse = active
}
