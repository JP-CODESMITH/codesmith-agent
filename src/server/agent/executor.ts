// Import the server-side tool registry for looking up registered tools
import { toolRegistry } from '../tools/registry'

// Execute a named tool with the given input parameters
// Returns the result or an error message if the tool fails or isn't found
export async function executeTool(
  toolName: string, // The name of the tool to look up and execute
  input: Record<string, unknown>, // The parameters to pass to the tool
): Promise<{ result: unknown; error?: string }> {
  // Look up the tool in the global registry by name
  const tool = toolRegistry.get(toolName)
  // If the tool doesn't exist, return an error indicating it wasn't found
  if (!tool) {
    return { result: null, error: `Tool "${toolName}" not found` }
  }

  try {
    // Attempt to execute the tool with the provided input
    const result = await tool.execute(input)
    return { result }
  } catch (err) {
    // If execution throws, return the error message
    return {
      result: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
