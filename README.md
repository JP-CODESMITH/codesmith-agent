# CodeSmith Agent

An AI agent platform built with Bun, TypeScript, TanStack Start, and React.

## Current Status

**Architectural Foundation** -- This project is in its initial scaffolding phase. The core architecture is in place but the agent is not yet functional. No LLM integration, web search, browser automation, or sandbox execution has been implemented.

## What is CodeSmith Agent?

CodeSmith Agent is an AI agent that can:

1. Receive a user goal
2. Reason through the task
3. Call tools
4. Observe their results
5. Continue working until the task is complete
6. Return a final answer

## Architecture

```
User Goal -> LLM -> Tool Selection -> Tool Execution -> Observation -> LLM -> ... -> Final Result
```

### Layers

- **Agent** -- Orchestrates the entire task
- **Agent Loop** -- Manages the think-act-observe cycle
- **AI Provider** -- Abstraction for LLM providers (Ollama, NVIDIA, OpenAI, Anthropic)
- **Tool System** -- Generic tool interface with registry
- **MCP** -- Model Context Protocol for future remote tool integration
- **Sandbox** -- Docker-based isolated execution for agent-generated commands

## Planned Tools

- **File Tool** -- Read, write, list files
- **Terminal Tool** -- Execute commands in sandbox
- **Web Search Tool** -- Search the internet
- **Browser Tool** -- Automate browser via Playwright
- **GitHub Tool** -- Interact with GitHub API

## AI Provider Abstraction

CodeSmith Agent is not locked to one LLM provider. The `AIProvider` interface allows swapping between:

- Ollama (local)
- NVIDIA API
- OpenAI-compatible APIs
- Anthropic-compatible APIs

## Security & Sandbox

All agent-generated terminal commands are routed through the sandbox layer. No arbitrary commands execute directly on the host machine. Sandboxing uses Docker containers with configurable resource limits.

## Local Development

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun run build

# Type check
bun run typecheck
```

## Configuration

Copy `.env.example` to `.env` and configure your AI provider:

```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

## Project Structure

```
codesmith-agent/
  src/
    routes/          -- TanStack Start file-based routing
    components/      -- React UI components
    features/        -- Domain types, schemas, constants
    server/
      agent/         -- Agent core (loop, planner, executor, state)
      ai/            -- AI provider abstraction
      tools/         -- Tool system and native tools
      mcp/           -- MCP client and registry
      sandbox/       -- Docker sandbox
    lib/             -- Shared utilities
    styles/          -- CSS (Tailwind)
```

## License

MIT
