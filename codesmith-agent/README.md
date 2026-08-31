# CodeSmith Agent

A local-first AI developer agent with a browser-based interface.

> **"An AI developer living in your local terminal, with a modern browser interface."**

## Quick Start

```bash
bun install
bun dev
# Opens at http://localhost:3000
```

## What It Does

- Start from terminal, get a browser UI
- Enter a natural language goal
- Agent plans, selects tools, executes locally, reasons, repeats
- Final result appears in the browser

## Tech Stack

Bun + TanStack Start + React 19 + Tailwind CSS v4 + TypeScript + Docker sandbox

## Documentation

**Full documentation: [CODESMITH.md](./CODESMITH.md)**

Covers architecture, agent loop, AI providers, tool system, sandbox, MCP, frontend, project structure, security model, and implementation roadmap.

## Configuration

Copy `.env.example` to `.env` and set your AI provider:

```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

## License

MIT
