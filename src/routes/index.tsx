// Import the file-route utility to define the home page route
import { createFileRoute } from '@tanstack/react-router'
// Import React's useState hook for managing component state
import { useState } from 'react'
// Import the agent input component for the user to type their goal
import { AgentInput } from '~/components/agent/AgentInput'
// Import the timeline component to display agent execution events
import { AgentTimeline } from '~/components/agent/AgentTimeline'
// Import the AgentStatus type for type-safe status handling
import type { AgentStatus } from '~/features/agent/types'

// Define the root route ('/') with the Home component
export const Route = createFileRoute('/')({
  component: Home,
})

// Main home page component: provides the UI for interacting with the agent
function Home() {
  // Track the current agent status (idle, thinking, running, etc.)
  const [status, setStatus] = useState<AgentStatus>('idle')
  // Track the timeline of events/messages from the agent
  const [timeline, setTimeline] = useState<string[]>([])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with the application title */}
      <header className="border-b border-gray-200 dark:border-gray-800 p-4">
        <h1 className="text-xl font-bold">CodeSmith Agent</h1>
      </header>

      {/* Main content area: input form centered on the page */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <AgentInput
          status={status}
          onSubmit={async (goal) => {
            // Set status to thinking when the user submits a goal
            setStatus('thinking')
            setTimeline(['Planning task...'])

            try {
              // Send the goal to the agent API endpoint via POST request
              const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal }),
              })
              const data = await res.json()
              // Append the agent's response to the timeline
              setTimeline((prev) => [...prev, data.message ?? 'Done.'])
            } catch {
              // Handle network/API errors
              setTimeline((prev) => [...prev, 'Failed to reach agent.'])
            } finally {
              // Reset status back to idle after the request completes
              setStatus('idle')
            }
          }}
        />
      </main>

      {/* Sidebar/timeline area showing agent execution events */}
      <aside className="border-t border-gray-200 dark:border-gray-800 p-4">
        <AgentTimeline status={status} events={timeline} />
      </aside>
    </div>
  )
}
