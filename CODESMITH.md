# CodeSmith Agent

**Version:** 0.1.0
**Status:** Phase 1 foundation

CodeSmith Agent is a local-first AI developer agent foundation. The current
repository supports a browser UI and now includes the terminal TUI, agent core
contracts, AI provider abstraction, tool abstraction, permission boundary,
session state, project detection, and git awareness needed for Phase 1.

## Current Architecture

```text
CodeSmith
    |
    +-- OpenTUI terminal UI
    |
    +-- TanStack Start browser UI
            |
            v
        Agent Core
            |
    +-------+-------+
    |               |
AI Providers       Tools
                    |
        +-----------+-----------+
        |           |           |
   Filesystem   Terminal       Git
        |           |           |
        +-----------+-----------+
                    |
            Permission Layer
                    |
              Local Machine
```

The browser implementation under `src/routes`, `src/components`, and
`src/server` is preserved. The new Phase 1 shared foundation lives at the top
level of `src` so both terminal and browser surfaces can converge on it over
time.

## Project Structure

```text
src/
  agent/              Shared agent turn foundation
  ai/                 Provider contracts and placeholder provider
  components/         Existing browser UI components
  features/           Existing browser/server agent types and schemas
  project/            Lightweight project detector
  routes/             Existing TanStack Start routes and API endpoint
  security/           Permission policy and command classification
  server/             Existing browser/server agent scaffolding
  session/            In-memory session state
  tools/              Shared tool interface, registry, native tools
  ui/
    shared/           Shared UI formatting helpers
    tui/              OpenTUI terminal interface
  index.ts            CLI entry point
```

## TUI Architecture

The terminal interface uses `@opentui/core` directly. It is intentionally not
coupled to the React browser tree.

Current TUI capabilities:

- CodeSmith branding
- current project path and detected project context
- conversation/message display
- single-line user input
- agent output through the placeholder provider
- tool status area
- error-ready session model
- safe exit with Ctrl+C or `q` when the input is empty
- non-interactive smoke mode for CI and local checks

Run it with:

```bash
bun run cli
```

or:

```bash
bun run codesmith
```

Smoke test:

```bash
bun run cli -- --smoke
```

The existing browser UI still runs with:

```bash
bun run dev
```

## Agent Architecture

`src/agent` contains the Phase 1 shared agent turn:

- `agent.ts` creates the default registry and placeholder provider.
- `loop.ts` accepts one user message, sends it to the provider boundary, and
  records the assistant response.
- `state.ts` wraps in-memory session mutation.
- `types.ts` defines the core agent input/output contracts.

This is not yet an autonomous think-act-observe agent. It is the contract and
state foundation that future iterations can expand.

## AI Provider Architecture

`src/ai/provider.ts` defines:

- `AIProvider`
- `sendMessage(...)`
- optional `streamResponse(...)`
- provider configuration shape
- placeholder provider

Future providers can include NVIDIA, OpenAI, Anthropic, Google, and local
models. API keys must come from environment variables. No secrets are stored in
source.

Environment variables:

```bash
AI_PROVIDER=ollama
NVIDIA_API_KEY=
OPENAI_API_KEY=
OPENAI_BASE_URL=
ANTHROPIC_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
```

## Tool Architecture

`src/tools` defines:

- `Tool`
- `ToolResult`
- `ToolExecutionContext`
- `ToolRegistry`

Initial tools:

- `filesystem.list`
- `filesystem.read`
- `filesystem.search`
- `filesystem.exists`
- `terminal.execute`
- `git.status`
- `git.diff`
- `git.log`
- `git.branch`

The tools are callable through the registry, but the agent does not call tools
autonomously yet.

## Security Boundary

All tool execution is designed to pass through:

```text
AI -> Agent -> Tool -> Permission / Policy -> Execution
```

`src/security` provides the Phase 1 policy boundary:

- allowed read-only operations
- denied disk/system operations such as `mkfs`, `dd`, `shutdown`, and `reboot`
- approval-required commands such as `sudo`, `rm`, `chmod`, `chown`,
  `curl | sh`, `wget | sh`, destructive Docker commands, and destructive Git
  commands

If a command requires approval and no approval flag is supplied, the terminal
tool refuses to run it. This is a foundation, not a production sandbox.

## Project Detection

`src/project/detector.ts` detects project context from shallow markers:

- `package.json`
- `bun.lock`
- `tsconfig.json`
- `vite.config.*`
- `next.config.*`
- `pyproject.toml`
- `requirements.txt`
- `pubspec.yaml`
- `Dockerfile`
- `docker-compose.yml`
- `.git`

The detector avoids broad filesystem scans.

## Development Commands

```bash
bun install
bun run dev
bun run cli
bun run codesmith
bun run typecheck
bun run build
```

There is currently no dedicated test script.

## Intentionally Not Implemented Yet

Phase 1 does not include:

- autonomous coding
- multi-step planning
- browser automation
- MCP ecosystem integration
- multi-agent orchestration
- long-term memory
- remote execution
- distributed agents
- production sandboxing
- automatic commits, pushes, resets, checkouts, or destructive git operations

The goal for this phase is a strong local foundation, not a complete agent.
