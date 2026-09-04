// Import the TanStack React Router file-route utility
import { createFileRoute } from '@tanstack/react-router'
// Import the server function utility for calling server-side code from the client
import { createServerFn } from '@tanstack/react-start'
// Import the Zod schema for validating incoming request data
import { AgentInputSchema } from '~/features/agent/schemas'
// Import the agent runner that processes the user's goal
import { runAgent } from '~/server/agent/agent'

// Define the /api/agent route with a POST handler for agent requests
export const Route = createFileRoute('/api/agent')({
  server: {
    handlers: {
      // Handle POST requests to the agent API endpoint
      POST: async ({ request }) => {
        try {
          // Parse the JSON body from the HTTP request
          const body = await request.json()
          // Validate the request body against the input schema
          const parsed = AgentInputSchema.safeParse(body)

          // If validation fails, return a 400 error with details
          if (!parsed.success) {
            return Response.json(
              { error: 'Invalid input', details: parsed.error.flatten() },
              { status: 400 },
            )
          }

          // Execute the agent with the validated input and return the result
          const result = await runAgent(parsed.data)
          return Response.json(result)
        } catch (err) {
          // Log any unexpected errors and return a 500 server error
          console.error('Agent API error:', err)
          return Response.json(
            { error: 'Internal server error' },
            { status: 500 },
          )
        }
      },
    },
  },
  component: () => null, // No client-side component for this API route
})
