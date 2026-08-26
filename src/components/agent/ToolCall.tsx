import type { ToolCall as ToolCallType } from '~/features/agent/types'

interface ToolCallProps {
  call: ToolCallType
}

export function ToolCall({ call }: ToolCallProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-blue-600 dark:text-blue-400">
          {call.tool}
        </span>
        <ToolCallStatus status={call.status} />
      </div>
      <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
        {JSON.stringify(call.input, null, 2)}
      </pre>
      {call.result !== undefined && call.result !== null && (
        <pre className="mt-2 text-xs text-green-600 dark:text-green-400 overflow-x-auto">
          {JSON.stringify(call.result, null, 2)}
        </pre>
      )}
    </div>
  )
}

function ToolCallStatus({ status }: { status: ToolCallType['status'] }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  )
}
