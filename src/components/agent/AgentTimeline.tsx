import type { AgentStatus } from '~/features/agent/types'

interface AgentTimelineProps {
  status: AgentStatus
  events: string[]
}

export function AgentTimeline({ status, events }: AgentTimelineProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <StatusIndicator status={status} />
        <span className="capitalize">{status}</span>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-600 text-sm">
          No task running.
        </p>
      ) : (
        <ul className="space-y-1">
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

function StatusIndicator({ status }: { status: AgentStatus }) {
  if (status === 'idle') {
    return <span className="w-2 h-2 rounded-full bg-gray-400" />
  }
  if (status === 'failed') {
    return <span className="w-2 h-2 rounded-full bg-red-500" />
  }
  return <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
}
