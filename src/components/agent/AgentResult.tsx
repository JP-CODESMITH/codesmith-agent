import type { AgentResult as AgentResultType } from '~/features/agent/types'

interface AgentResultProps {
  result: AgentResultType
}

export function AgentResult({ result }: AgentResultProps) {
  const statusStyles = {
    completed: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
    failed: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20',
    cancelled: 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20',
    idle: 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20',
    thinking: '',
    planning: '',
    executing: '',
    waiting: '',
    running: '',
  }

  return (
    <div className={`border rounded-lg p-4 ${statusStyles[result.status]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold">Status:</span>
        <span className="capitalize">{result.status}</span>
      </div>
      <p className="text-sm">{result.message}</p>
    </div>
  )
}
