# CodeSmith Agent

A local-first AI developer agent with browser and terminal interfaces.

> **"An AI developer living in your local terminal, with a modern browser interface."**

## Quick Start

```bash
bun install
bun run cli
```

For the existing browser UI:

```bash
bun run dev
# Opens at http://localhost:3000
```

## What It Does

- Start the OpenTUI terminal interface with `bun run cli`
- Run the existing browser UI with `bun run dev`
- Track project context, session state, tool definitions, and permission policy
- Prepare for provider-backed agent turns without hard-coding secrets

## Tech Stack

Bun + TypeScript + OpenTUI + TanStack Start + React 19 + Tailwind CSS v4

## Documentation

**Full documentation: [CODESMITH.md](./CODESMITH.md)**

Covers the current Phase 1 architecture, TUI, agent core, AI providers, tool system, security boundary, project detection, and implementation limits.

## Configuration

Copy `.env.example` to `.env` and set your AI provider:

```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

## License

MIT
