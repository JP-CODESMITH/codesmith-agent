# Phase 1 Walkthrough

This guide explains the Phase 1 files that were added for the terminal agent
foundation. Read it in this order when the code feels confusing.

## 1. Entry Point

File: `src/index.ts`

This is the terminal entry point. When you run:

```bash
bun run cli
```

Bun executes `src/index.ts`. If the file is running as the main program, it
starts `runCodeSmithTui(...)`.

It also exports the agent and project detector so future code can reuse them.

## 2. Terminal UI

File: `src/ui/tui/app.ts`

This file creates the OpenTUI interface.

Main flow:

1. Detect the current project with `detectProject(...)`.
2. Create a new in-memory session with `createCodeSmithSession(...)`.
3. If the terminal is not interactive, print a smoke-test summary and exit.
4. If the terminal is interactive, create an OpenTUI renderer.
5. Build the screen from renderables:
   - `root`
   - `frame`
   - `header`
   - `body`
   - `status`
   - `input`
6. When the user presses Enter, call `submit(...)`.
7. `submit(...)` sends the message to `runAgentTurn(...)`.
8. The placeholder AI provider returns a foundation response.
9. The screen refreshes with the latest session state.

The TUI does not run autonomous tools yet. It only proves the user interface,
session flow, and agent-provider boundary.

## 3. Agent Core

Files:

- `src/agent/agent.ts`
- `src/agent/loop.ts`
- `src/agent/state.ts`
- `src/agent/types.ts`

`src/agent/agent.ts` wires together the default parts:

- project detector
- session creator
- placeholder AI provider
- permission gate
- tool registry

`src/agent/loop.ts` handles one agent turn:

1. Store the user message.
2. Mark the session as thinking.
3. Convert session messages into AI provider messages.
4. Pass available tools as definitions to the provider.
5. Store the assistant response.
6. Mark the session as completed.

This is intentionally simple. Phase 1 creates the shape of the system. It does
not implement full planning or automatic tool use.

## 4. AI Provider Boundary

Files:

- `src/ai/provider.ts`
- `src/ai/types.ts`
- `src/ai/providers/README.md`

`AIProvider` is the contract all future model providers must follow.

The important methods are:

- `sendMessage(...)`
- optional `streamResponse(...)`

The current provider is `PlaceholderAIProvider`. It returns a fixed message so
the rest of the application can be tested without API keys.

Future providers should read keys from environment variables such as:

- `NVIDIA_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

No provider should hard-code secrets.

## 5. Session State

Files:

- `src/session/session.ts`
- `src/session/types.ts`

The session tracks what happened during a run:

- current project
- messages
- tool executions
- errors
- current agent state

This is in-memory only. Closing the process loses the session. That is intended
for Phase 1.

## 6. Project Detection

Files:

- `src/project/detector.ts`
- `src/project/context.ts`

The detector looks for common project marker files in the project root. It does
not scan the whole filesystem.

It can detect markers such as:

- `package.json`
- `bun.lock`
- `tsconfig.json`
- `vite.config.ts`
- `Dockerfile`
- `.git`

The TUI uses this to show the current project path and project type.

## 7. Tool System

Files:

- `src/tools/tool.ts`
- `src/tools/registry.ts`
- `src/tools/filesystem/index.ts`
- `src/tools/terminal/index.ts`
- `src/tools/git/index.ts`

The registry stores available tools by name.

Initial tool names:

- `filesystem.list`
- `filesystem.read`
- `filesystem.search`
- `filesystem.exists`
- `terminal.execute`
- `git.status`
- `git.diff`
- `git.log`
- `git.branch`

Each tool receives a `ToolExecutionContext`. That context includes:

- current working directory
- permission gate

This means tool code has a clear place to check whether an operation is allowed.

## 8. Security And Permissions

Files:

- `src/security/permissions.ts`
- `src/security/policy.ts`
- `src/security/types.ts`

The expected execution chain is:

```text
AI -> Agent -> Tool -> Permission / Policy -> Execution
```

The current policy has three decisions:

- `allow`
- `deny`
- `requires_approval`

Examples:

- `git status` is allowed.
- `rm file.txt` requires approval.
- `dd` and `mkfs` are denied.

This is not a complete sandbox. It is the first clear boundary that prevents
future agent code from directly executing operating-system actions.

## 9. Browser UI

Existing browser files were preserved:

- `src/routes/*`
- `src/components/agent/*`
- `src/features/agent/*`
- `src/server/*`

The browser app still runs with:

```bash
bun run dev
```

The next cleanup step is to make the browser API call the same shared
`src/agent` core used by the TUI.

## 10. Quick Mental Model

Think of the project like this:

```text
src/index.ts
  starts
src/ui/tui/app.ts
  shows the terminal interface
src/agent/loop.ts
  handles one user message
src/ai/provider.ts
  returns an AI response
src/session/session.ts
  stores what happened
src/tools/*
  defines actions the agent can use later
src/security/*
  decides whether actions are allowed
```

That is Phase 1: a clean foundation, not a full autonomous coding agent.
