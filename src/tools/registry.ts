// Import the Tool type for type-safe tool storage
import type { Tool } from './tool'

// ToolRegistry stores and manages all available tools using a Map for efficient lookup
export class ToolRegistry {
  // Internal Map storing tools by their name for O(1) lookup
  private readonly tools = new Map<string, Tool>()

  // Register a new tool in the registry
  register(tool: Tool): void {
    this.tools.set(tool.name, tool)
  }

  // Retrieve a tool by its name, returning undefined if not found
  get(name: string): Tool | undefined {
    return this.tools.get(name)
  }

  // Return all registered tools as an array
  list(): Tool[] {
    return Array.from(this.tools.values())
  }
}

// Factory function to create a ToolRegistry pre-populated with the given tools
export function createToolRegistry(tools: Tool[] = []): ToolRegistry {
  const registry = new ToolRegistry() // Create a new empty registry
  for (const tool of tools) {
    registry.register(tool) // Register each provided tool
  }
  return registry
}
