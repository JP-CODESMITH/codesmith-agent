import { toolRegistry } from '../tools/registry'

export async function executeTool(
  toolName: string,
  input: Record<string, unknown>,
): Promise<{ result: unknown; error?: string }> {
  const tool = toolRegistry.get(toolName)
  if (!tool) {
    return { result: null, error: `Tool "${toolName}" not found` }
  }

  try {
    const result = await tool.execute(input)
    return { result }
  } catch (err) {
    return {
      result: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
