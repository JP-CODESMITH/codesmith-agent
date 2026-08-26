import { z } from 'zod'

export const AgentInputSchema = z.object({
  goal: z.string().min(1, 'Goal is required').max(10000, 'Goal is too long'),
})

export type AgentInputValidated = z.infer<typeof AgentInputSchema>
