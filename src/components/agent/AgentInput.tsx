import { useState } from 'react'
import type { AgentStatus } from '~/features/agent/types'

interface AgentInputProps {
  status: AgentStatus
  onSubmit: (goal: string) => Promise<void>
}

export function AgentInput({ status, onSubmit }: AgentInputProps) {
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!goal.trim() || loading) return
    setLoading(true)
    try {
      await onSubmit(goal)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="What do you want me to accomplish?"
        rows={4}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || status === 'running'}
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 text-lg transition-colors"
      >
        {loading ? 'Running...' : 'Run Agent'}
      </button>
    </div>
  )
}
