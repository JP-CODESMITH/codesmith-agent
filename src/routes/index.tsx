import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AgentInput } from '~/components/agent/AgentInput'
import { AgentTimeline } from '~/components/agent/AgentTimeline'
import type { AgentStatus } from '~/features/agent/types'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [status, setStatus] = useState<AgentStatus>('idle')
  const [timeline, setTimeline] = useState<string[]>([])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800 p-4">
        <h1 className="text-xl font-bold">CodeSmith Agent</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <AgentInput
          status={status}
          onSubmit={async (goal) => {
            setStatus('thinking')
            setTimeline(['Planning task...'])

            try {
              const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal }),
              })
              const data = await res.json()
              setTimeline((prev) => [...prev, data.message ?? 'Done.'])
            } catch {
              setTimeline((prev) => [...prev, 'Failed to reach agent.'])
            } finally {
              setStatus('idle')
            }
          }}
        />
      </main>

      <aside className="border-t border-gray-200 dark:border-gray-800 p-4">
        <AgentTimeline status={status} events={timeline} />
      </aside>
    </div>
  )
}
