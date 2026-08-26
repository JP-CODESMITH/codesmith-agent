import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { AgentInputSchema } from '~/features/agent/schemas'
import { runAgent } from '~/server/agent/agent'

export const Route = createFileRoute('/api/agent')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const parsed = AgentInputSchema.safeParse(body)

          if (!parsed.success) {
            return Response.json(
              { error: 'Invalid input', details: parsed.error.flatten() },
              { status: 400 },
            )
          }

          const result = await runAgent(parsed.data)
          return Response.json(result)
        } catch (err) {
          console.error('Agent API error:', err)
          return Response.json(
            { error: 'Internal server error' },
            { status: 500 },
          )
        }
      },
    },
  },
  component: () => null,
})
