import type { Tool } from './tool'

export class ToolRegistry {
  private readonly tools = new Map<string, Tool>()

  register(tool: Tool): void {
    this.tools.set(tool.name, tool)
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name)
  }

  list(): Tool[] {
    return Array.from(this.tools.values())
  }
}

export function createToolRegistry(tools: Tool[] = []): ToolRegistry {
  const registry = new ToolRegistry()
  for (const tool of tools) {
    registry.register(tool)
  }
  return registry
}
