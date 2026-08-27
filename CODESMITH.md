# CodeSmith Agent

**Version:** 0.1.0
**Status:** Architectural Foundation (Scaffolding Phase)

---

## 1. What Is CodeSmith Agent?

CodeSmith Agent is a **local-first AI developer agent**. It runs on the user's machine, reads and writes local files, executes commands in a sandbox, and presents a modern browser-based interface — all without sending the user's project to a cloud service.

The product should feel like:

> **"An AI developer living in your local terminal, with a modern browser interface."**

---

## 2. Core User Experience

### 2.1 Intended Flow

```text
User opens terminal
        ↓
codesmith
        ↓
CodeSmith Agent starts local runtime
        ↓
Local server starts (port 3000)
        ↓
Browser UI opens automatically
        ↓
User enters a goal
        ↓
Agent plans
        ↓
Agent selects tools
        ↓
Tools execute locally / through controlled services
        ↓
Results return to agent
        ↓
Agent reasons again
        ↓
Agent continues until task is complete
        ↓
Final result appears in browser
```

### 2.2 User Expectations

| Expectation | How CodeSmith Delivers |
|---|---|
| No cloud upload required | Agent reads local files via sandbox, not cloud sync |
| Modern browser UI | TanStack Start + React + Tailwind CSS |
| Terminal-native startup | `codesmith` CLI command starts everything |
| Transparent reasoning | User sees every step: thinking, tool calls, results |
| Sandboxed execution | Docker containers isolate agent-generated commands |
| Pluggable AI | Swap between Ollama, NVIDIA, OpenAI, Anthropic |

---

## 3. Architecture

### 3.1 High-Level Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Browser UI                         │
│  (React, TanStack Router, Tailwind CSS)                 │
│                                                         │
│  ┌──────────┐ ┌──────────────┐ ┌─────────────────────┐ │
│  │AgentInput│ │AgentTimeline │ │AgentResult/ToolCall │ │
│  └──────────┘ └──────────────┘ └─────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (POST /api/agent)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Local Server                         │
│  (TanStack Start, Bun runtime, port 3000)               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Agent Layer                         │    │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────┐   │    │
│  │  │  Loop   │ │ Planner  │ │   Executor     │   │    │
│  │  └─────────┘ └──────────┘ └────────────────┘   │    │
│  │  ┌─────────┐                                    │    │
│  │  │  State  │                                    │    │
│  │  └─────────┘                                    │    │
│  └──────────────────────┬──────────────────────────┘    │
│                         │                               │
│  ┌──────────┐  ┌────────┴───────┐  ┌──────────────┐    │
│  │AI Provider│  │  Tool System   │  │  MCP Client  │    │
│  │(Ollama/   │  │  (Registry +   │  │  (Future     │    │
│  │ OpenAI/   │  │   Native Tools)│  │   Remote     │    │
│  │ Anthropic)│  │               │  │   Tools)     │    │
│  └──────────┘  └────────┬───────┘  └──────────────┘    │
│                         │                               │
│                  ┌──────┴───────┐                       │
│                  │   Sandbox    │                       │
│                  │  (Docker)    │                       │
│                  └──────────────┘                       │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  User's Filesystem  │
              │  (Controlled Access)│
              └─────────────────────┘
```

### 3.2 Layer Responsibilities

| Layer | Responsibility | Location |
|---|---|---|
| **Browser UI** | User interaction, goal input, timeline display, results | `src/components/`, `src/routes/` |
| **Agent** | Orchestrates think-act-observe cycle | `src/server/agent/` |
| **AI Provider** | LLM abstraction (prompt → response + tool calls) | `src/server/ai/` |
| **Tool System** | Generic tool interface, registry, native tools | `src/server/tools/` |
| **MCP** | Model Context Protocol for remote tool integration | `src/server/mcp/` |
| **Sandbox** | Docker-based isolated command execution | `src/server/sandbox/` |

---

## 4. Agent Core

### 4.1 The Agent Loop

The agent operates on a **think-act-observe** cycle:

```text
┌──────────────────────────────────────────────┐
│                  Agent Loop                  │
│                                              │
│  ┌─────────┐                                 │
│  │  Start  │  Create session from user goal  │
│  └────┬────┘                                 │
│       ▼                                      │
│  ┌─────────┐                                 │
│  │  Think  │  LLM reasons about the goal    │
│  └────┬────┘                                 │
│       ▼                                      │
│  ┌─────────┐    ┌─────────┐                  │
│  │  Plan   │───▶│ Execute │  Run tool calls  │
│  └────┬────┘    └────┬────┘                  │
│       │              │                       │
│       ▼              ▼                       │
│  ┌─────────┐                                 │
│  │ Observe │  LLM reads tool results         │
│  └────┬────┘                                 │
│       │                                      │
│       ▼                                      │
│  ┌─────────┐  No                             │
│  │  Done?  │──────▶ loop back to Think       │
│  └────┬────┘                                 │
│       │ Yes                                  │
│       ▼                                      │
│  ┌─────────┐                                 │
│  │ Result  │  Return final answer            │
│  └─────────┘                                 │
└──────────────────────────────────────────────┘
```

### 4.2 State Machine

Agent status transitions follow this lifecycle:

```
idle → running → thinking → planning → executing → waiting
                                    ↓
                              completed
                                    ↓
                               failed / cancelled
```

| Status | Description |
|---|---|
| `idle` | No task running |
| `running` | Agent loop has started |
| `thinking` | LLM is reasoning about the current step |
| `planning` | Agent is deciding which tools to call |
| `executing` | A tool is running |
| `waiting` | Waiting for tool result |
| `completed` | Task finished successfully |
| `failed` | Task hit an unrecoverable error |
| `cancelled` | User or system cancelled the task |

### 4.3 Session Model

```typescript
interface AgentSession {
  id: string              // Unique session UUID
  goal: string            // User-provided objective
  status: AgentStatus     // Current lifecycle state
  steps: AgentStep[]      // Ordered list of actions taken
  createdAt: number       // Epoch timestamp
  updatedAt: number       // Epoch timestamp
}

interface AgentStep {
  id: string              // Step UUID
  event: AgentEventType   // What happened in this step
  content: string         // Description or reasoning text
  toolCalls?: ToolCall[]  // Tools invoked in this step
  timestamp: number       // Epoch timestamp
}

interface ToolCall {
  id: string              // Tool call UUID
  tool: string            // Tool name (e.g., "file", "terminal")
  input: Record<string, unknown>  // Tool-specific arguments
  result?: unknown        // Tool execution output
  status: 'pending' | 'running' | 'completed' | 'failed'
}
```

### 4.4 Configuration

```typescript
const AGENT_CONFIG = {
  MAX_STEPS: 20,                  // Maximum loop iterations
  MAX_TOOL_CALLS_PER_STEP: 5,     // Tool calls per LLM response
  STEP_TIMEOUT_MS: 30_000,        // 30s timeout per step
}
```

---

## 5. AI Provider

### 5.1 Interface

```typescript
interface AIProvider {
  readonly name: string
  generateResponse(request: AIRequest): Promise<AIResponse>
}

interface AIRequest {
  messages: AIMessage[]
  tools?: AIToolDefinition[]
  temperature?: number
  maxTokens?: number
}

interface AIResponse {
  message: string
  toolCalls: AIToolCall[]
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}
```

### 5.2 Supported Providers

| Provider | Type | Config Key |
|---|---|---|
| Ollama | Local | `AI_PROVIDER=ollama`, `OLLAMA_BASE_URL` |
| NVIDIA | Cloud | `AI_PROVIDER=nvidia`, `NVIDIA_API_KEY` |
| OpenAI | Cloud | `AI_PROVIDER=openai`, `OPENAI_API_KEY`, `OPENAI_BASE_URL` |
| Anthropic | Cloud | `AI_PROVIDER=anthropic`, `ANTHROPIC_API_KEY` |

### 5.3 System Prompt

```
You are CodeSmith Agent, an AI assistant that can use tools to accomplish user goals.

You have access to the following capabilities:
- Read and write files
- Execute terminal commands in a sandboxed environment
- Search the web
- Automate browser interactions

When given a goal:
1. Think about the best approach
2. Break it into steps
3. Use tools as needed
4. Report your progress
5. Return a final answer

Always be precise and explain your reasoning.
```

---

## 6. Tool System

### 6.1 Tool Interface

Every tool implements:

```typescript
interface AgentTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>  // JSON Schema for validation
  execute(input: Record<string, unknown>): Promise<unknown>
}
```

### 6.2 Tool Registry

The `ToolRegistry` class manages tool lifecycle:

```typescript
class ToolRegistry {
  register(tool: AgentTool): void       // Add a tool
  get(name: string): AgentTool | undefined  // Retrieve by name
  list(): AgentTool[]                   // All enabled tools
  remove(name: string): boolean         // Unregister
  enable(name: string): void            // Re-enable
  disable(name: string): void           // Disable without removing
}
```

A singleton `toolRegistry` instance is exported for use throughout the server.

### 6.3 Native Tools

| Tool | Name | Description | Actions |
|---|---|---|---|
| **File Tool** | `file` | Read, write, list files | `read`, `write`, `list` |
| **Terminal Tool** | `terminal` | Execute shell commands | `command`, `cwd`, `timeout` |
| **Search Tool** | `search` | Web search | `query`, `numResults` |
| **Browser Tool** | `browser` | Automate browser | `navigate`, `click`, `extract`, `screenshot` |

### 6.4 Tool Input Schemas

**File Tool**
```json
{
  "action": { "type": "string", "enum": ["read", "write", "list"] },
  "path": { "type": "string" },
  "content": { "type": "string" }
}
```

**Terminal Tool**
```json
{
  "command": { "type": "string" },
  "cwd": { "type": "string" },
  "timeout": { "type": "number" }
}
```

**Search Tool**
```json
{
  "query": { "type": "string" },
  "numResults": { "type": "number" }
}
```

**Browser Tool**
```json
{
  "action": { "type": "string", "enum": ["navigate", "click", "extract", "screenshot"] },
  "url": { "type": "string" },
  "selector": { "type": "string" }
}
```

---

## 7. Sandbox

### 7.1 Purpose

All agent-generated terminal commands execute inside Docker containers. The agent **never** runs arbitrary commands directly on the host machine.

### 7.2 Sandbox Interface

```typescript
interface Sandbox {
  id: string
  create(options?: SandboxOptions): Promise<void>
  execute(command: string, options?: { cwd?: string; timeout?: number }): Promise<{
    stdout: string
    stderr: string
    exitCode: number
  }>
  readFile(path: string): Promise<string>
  writeFile(path: string, content: string): Promise<void>
  destroy(): Promise<void>
}
```

### 7.3 Options

```typescript
interface SandboxOptions {
  image?: string        // Docker image (default: base Bun image)
  memoryLimit?: string  // e.g., "512m"
  cpuLimit?: number     // CPU cores
  timeout?: number      // Max runtime in ms
}
```

### 7.4 Lifecycle

```text
create()  →  execute()  →  execute()  →  ...  →  destroy()
   │              │              │                    │
   ▼              ▼              ▼                    ▼
 Docker        Docker         Docker              Docker
 create        exec           exec                rm
```

---

## 8. MCP (Model Context Protocol)

### 8.1 Purpose

MCP enables integration with remote tool servers. External services can expose tools that the agent discovers and uses alongside native tools.

### 8.2 Interface

```typescript
interface MCPClient {
  connect(serverName: string, url: string): Promise<MCPConnection>
  disconnect(serverName: string): Promise<void>
  listTools(serverName: string): Promise<MCPServerInfo>
  getConnection(serverName: string): MCPConnection | undefined
}

interface MCPRegistry {
  register(name: string, info: MCPServerInfo): void
  get(name: string): MCPServerInfo | undefined
  list(): MCPServerInfo[]
  remove(name: string): boolean
}
```

### 8.3 Data Model

```typescript
interface MCPTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

interface MCPServerInfo {
  name: string
  version: string
  tools: MCPTool[]
}

interface MCPConnection {
  serverName: string
  url: string
  connected: boolean
}
```

---

## 9. Frontend

### 9.1 Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (SSR + file-based routing) |
| Router | TanStack React Router |
| Styling | Tailwind CSS v4 |
| UI Library | React 19 |
| Validation | Zod v4 |
| Language | TypeScript (strict mode) |
| Runtime | Bun |

### 9.2 Route Structure

```
src/routes/
  __root.tsx          → Root HTML shell
  index.tsx           → Home page (agent UI)
  api/agent.tsx       → POST /api/agent endpoint
```

### 9.3 Component Tree

```
RootDocument
  └── Home (index.tsx)
        ├── AgentInput       → Goal textarea + submit button
        ├── AgentTimeline    → Status indicator + event list
        ├── AgentMessage     → Role-labeled message bubble
        ├── ToolCall         → Tool invocation display
        └── AgentResult      → Final result card
```

### 9.4 Component Details

**AgentInput**
- Textarea for goal entry (max 10,000 chars)
- Submit button with loading state
- Calls `POST /api/agent` with `{ goal }`

**AgentTimeline**
- Status indicator (idle/thinking/running/failed)
- Scrollable event list with checkmarks

**AgentMessage**
- Role-styled bubbles (user/assistant/system)

**ToolCall**
- Tool name in monospace
- Status badge (pending/running/completed/failed)
- JSON input and result display

**AgentResult**
- Status-colored card (completed/failed/cancelled)
- Final message display

### 9.5 API Contract

**POST /api/agent**

Request:
```json
{ "goal": "string (1-10000 chars)" }
```

Success Response:
```json
{
  "status": "completed | failed | cancelled",
  "message": "string",
  "session": { "id": "...", "goal": "...", "status": "...", "steps": [...] }
}
```

Error Response:
```json
{
  "error": "Invalid input | Internal server error",
  "details": { ... }
}
```

---

## 10. Project Structure

```
codesmith-agent/
├── src/
│   ├── components/
│   │   └── agent/
│   │       ├── AgentInput.tsx         # Goal input form
│   │       ├── AgentMessage.tsx       # Message bubble
│   │       ├── AgentResult.tsx        # Final result display
│   │       ├── AgentTimeline.tsx      # Status + event log
│   │       └── ToolCall.tsx           # Tool invocation display
│   ├── features/
│   │   └── agent/
│   │       ├── constants.ts           # Agent config, tool names
│   │       ├── schemas.ts             # Zod validation schemas
│   │       └── types.ts               # TypeScript type definitions
│   ├── lib/
│   │   ├── env.ts                     # Environment config (Zod-validated)
│   │   ├── logger.ts                  # Leveled logging utility
│   │   └── utils.ts                   # Shared helpers
│   ├── routes/
│   │   ├── __root.tsx                 # Root HTML document
│   │   ├── index.tsx                  # Home page
│   │   └── api/
│   │       └── agent.tsx              # Agent API endpoint
│   ├── server/
│   │   ├── agent/
│   │   │   ├── agent.ts               # Entry point (runAgent)
│   │   │   ├── executor.ts            # Tool execution dispatcher
│   │   │   ├── loop.ts                # Think-act-observe cycle
│   │   │   ├── planner.ts             # LLM-driven step planner
│   │   │   └── state.ts               # Session state management
│   │   ├── ai/
│   │   │   ├── prompts.ts             # System prompt + tool descriptions
│   │   │   ├── provider.ts            # AI provider factory/registry
│   │   │   └── types.ts               # AI interface definitions
│   │   ├── mcp/
│   │   │   ├── client.ts              # MCP protocol client
│   │   │   ├── registry.ts            # MCP server registry
│   │   │   └── types.ts               # MCP type definitions
│   │   ├── sandbox/
│   │   │   ├── docker.ts              # Docker sandbox implementation
│   │   │   ├── sandbox.ts             # Sandbox factory
│   │   │   └── types.ts               # Sandbox interface
│   │   └── tools/
│   │       ├── native/
│   │       │   ├── browser.ts         # Browser automation tool
│   │       │   ├── files.ts           # File read/write/list tool
│   │       │   ├── search.ts          # Web search tool
│   │       │   └── terminal.ts        # Terminal command tool
│   │       ├── registry.ts            # Tool registry class
│   │       └── types.ts               # Tool interface definitions
│   ├── styles/
│   │   └── app.css                    # Tailwind CSS entry
│   ├── router.tsx                     # TanStack Router setup
│   └── routeTree.gen.ts               # Auto-generated route tree
├── .env.example                       # Environment template
├── .gitignore
├── Dockerfile                         # Multi-stage Bun build
├── package.json
├── tsconfig.json
├── vite.config.ts                     # Vite + TanStack + Tailwind
└── bun.lock
```

---

## 11. Technology Stack

| Category | Choice | Version | Purpose |
|---|---|---|---|
| Runtime | Bun | latest | Fast JS/TS runtime |
| Framework | TanStack Start | ^1.168 | SSR + file routing |
| Router | TanStack React Router | ^1.170 | Client-side routing |
| UI | React | ^19.0 | Component library |
| Styling | Tailwind CSS | ^4.2 | Utility-first CSS |
| Validation | Zod | ^4.4 | Schema validation |
| Language | TypeScript | ^5.7 | Type safety |
| Bundler | Vite | ^8.0 | Build tooling |
| Container | Docker | - | Sandbox execution |

---

## 12. Environment Configuration

Copy `.env.example` to `.env`:

```bash
# AI Provider selection
AI_PROVIDER=ollama          # ollama | nvidia | openai | anthropic

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434

# NVIDIA
NVIDIA_API_KEY=

# OpenAI
OPENAI_API_KEY=
OPENAI_BASE_URL=            # Optional: for OpenAI-compatible APIs

# Anthropic
ANTHROPIC_API_KEY=

# Logging
LOG_LEVEL=info              # debug | info | warn | error
```

---

## 13. Development

### 13.1 Prerequisites

- [Bun](https://bun.sh) runtime
- [Docker](https://docker.com) (for sandbox execution)
- An AI provider (Ollama local, or API key for cloud providers)

### 13.2 Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Type check
bun run typecheck

# Preview production build
bun run preview
```

### 13.3 Development Server

Starts on `http://localhost:3000`. TanStack Start handles both the API routes and the React frontend in a single server process.

---

## 14. Docker

### 14.1 Production Image

```bash
# Build
docker build -t codesmith-agent .

# Run
docker run -p 3000:3000 codesmith-agent
```

The Dockerfile uses a multi-stage build:
1. **deps** — Install dependencies with frozen lockfile
2. **builder** — Build the application
3. **runner** — Minimal production image with built output

---

## 15. Security Model

### 15.1 Principles

1. **Local-first** — No project data leaves the user's machine unless explicitly configured
2. **Sandboxed execution** — All agent commands run in Docker, never on the host
3. **Controlled access** — File operations go through the sandbox layer
4. **Environment isolation** — API keys stay in `.env`, never committed

### 15.2 Execution Boundaries

```text
┌─────────────────────────────────────────┐
│           Host Machine                  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     CodeSmith Server            │    │
│  │     (port 3000)                 │    │
│  │                                 │    │
│  │  Agent ←→ AI Provider (cloud)   │    │
│  │     │                           │    │
│  │     ▼                           │    │
│  │  ┌─────────────────────────┐    │    │
│  │  │    Docker Sandbox       │    │    │
│  │  │    (isolated container) │    │    │
│  │  │                         │    │    │
│  │  │  - File operations      │    │    │
│  │  │  - Shell commands       │    │    │
│  │  │  - Browser automation   │    │    │
│  │  └─────────────────────────┘    │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Local Filesystem (read/write via       │
│  sandbox volume mounts)                 │
└─────────────────────────────────────────┘
```

---

## 16. Implementation Roadmap

### Phase 1: Foundation (Current)
- [x] Project scaffolding (TanStack Start + React + Tailwind)
- [x] Agent type system (types, schemas, constants)
- [x] Agent loop skeleton (state machine, session management)
- [x] Tool registry (interface, registration, lookup)
- [x] Native tool stubs (file, terminal, search, browser)
- [x] AI provider interface + placeholder
- [x] Sandbox interface + Docker stub
- [x] MCP client/registry stubs
- [x] Basic UI (input, timeline, message, tool call, result)
- [x] API endpoint (POST /api/agent)

### Phase 2: AI Integration
- [ ] Implement Ollama provider (chat completions)
- [ ] Implement OpenAI provider (function calling)
- [ ] Implement Anthropic provider (tool use)
- [ ] Implement NVIDIA provider
- [ ] Connect real LLM responses to planner
- [ ] Parse tool calls from LLM output

### Phase 3: Tool Implementation
- [ ] File tool (sandbox-based read/write/list)
- [ ] Terminal tool (sandbox command execution)
- [ ] Search tool (web search API integration)
- [ ] Browser tool (Playwright in sandbox)
- [ ] Tool result feedback loop

### Phase 4: Agent Loop Completion
- [ ] Multi-step reasoning (loop until complete)
- [ ] Tool call execution within loop
- [ ] Error recovery and retry logic
- [ ] Session persistence and resumption

### Phase 5: Sandbox Hardening
- [ ] Docker container lifecycle management
- [ ] Volume mounts for project access
- [ ] Resource limits (CPU, memory, timeout)
- [ ] Container cleanup and pooling

### Phase 6: MCP Integration
- [ ] MCP protocol implementation
- [ ] Remote tool discovery
- [ ] Tool proxying through MCP

### Phase 7: UI Polish
- [ ] Real-time streaming updates (SSE/WebSocket)
- [ ] Dark mode toggle
- [ ] Session history
- [ ] Tool call inspection panel
- [ ] Keyboard shortcuts

### Phase 8: CLI & Distribution
- [ ] `codesmith` CLI entry point
- [ ] Auto-open browser on start
- [ ] Configuration wizard
- [ ] npm/Bun package distribution
- [ ] Homebrew formula

---

## 17. Key Design Decisions

| Decision | Rationale |
|---|---|
| **Bun over Node.js** | Faster startup, native TypeScript, built-in test runner |
| **TanStack Start** | Unified SSR + API routes in single server, file-based routing |
| **Docker sandbox** | Strong isolation boundary, reproducible environment, resource limits |
| **Tool registry pattern** | Extensible — new tools register without modifying agent core |
| **Zod validation** | Runtime + compile-time type safety for inputs and environment |
| **Tailwind CSS v4** | Utility-first, dark mode support, no CSS-in-JS overhead |
| **Provider abstraction** | Avoid vendor lock-in, let users choose their AI backend |

---

## 18. Glossary

| Term | Definition |
|---|---|
| **Agent** | The autonomous system that plans and executes tasks |
| **Agent Loop** | The think-act-observe cycle the agent runs |
| **Goal** | A natural language task provided by the user |
| **Step** | A single iteration of the agent loop |
| **Tool** | A capability the agent can invoke (file, terminal, etc.) |
| **Sandbox** | An isolated Docker container for safe execution |
| **MCP** | Model Context Protocol — standard for remote tool integration |
| **Provider** | An AI/LLM backend (Ollama, OpenAI, etc.) |
| **Session** | A complete agent run from goal to result |
