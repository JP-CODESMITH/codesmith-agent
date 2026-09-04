// Import React's useState hook for managing the input field state
import { useState } from 'react'
// Import the AgentStatus type for type-safe status handling
import type { AgentStatus } from '~/features/agent/types'

// Props interface for the AgentInput component
interface AgentInputProps {
  status: AgentStatus              // Current agent status (affects UI state)
  onSubmit: (goal: string) => Promise<void> // Callback when the user submits a goal
}

// Input component where the user types their goal/request for the agent
export function AgentInput({ status, onSubmit }: AgentInputProps) {
  const [goal, setGoal] = useState('')       // Tracks the textarea input value
  const [loading, setLoading] = useState(false) // Tracks whether a request is in progress

  // Handle form submission: validate, call onSubmit, and manage loading state
  const handleSubmit = async () => {
    // Don't submit empty goals or if already loading
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
      {/* Textarea for the user to type their goal/request */}
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="What do you want me to accomplish?"
        rows={4}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Submit button, disabled during loading or when agent is already running */}
      <button
        onClick={handleSubmit}
        disabled={loading || status === 'running'}
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 text-lg transition-colors"
      >
        {loading ? 'Running...' : 'Run Agent'} // Dynamic button text based on loading state
      </button>
    </div>
  )
}
